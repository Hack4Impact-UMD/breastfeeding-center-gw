import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/services/clientService";
import queries from "@/queries";
import {
  getAllSquarespaceOrdersInRangeWithProfiles,
  SquarespaceOrderWithProfile,
} from "@/services/squarespaceService";
import { Client } from "@/types/ClientType";

export function useSquarespaceOrdersInRangeWithProfiles(
  startDate?: string,
  endDate?: string,
) {
  return useQuery<(SquarespaceOrderWithProfile & { client?: Client | null })[]>(
    {
      ...queries.squarespaceData.orders(startDate, endDate),
      queryFn: async (): Promise<
        (SquarespaceOrderWithProfile & { client?: Client | null })[]
      > => {
        const clients = await getAllClients();
        const orders = await getAllSquarespaceOrdersInRangeWithProfiles(
          startDate,
          endDate,
        );
        const emailToClientMap: Map<string, Client> = new Map();
        for (const client of clients) {
          emailToClientMap.set(client.email, client);
          for (const assoc of client.associatedClients ?? []) {
            emailToClientMap.set(assoc.email, client);
          }
        }

        return orders.map((order) => {
          const orderEmail =
            order.customerEmail ?? order.customerProfile?.email;

          const client = orderEmail
            ? (emailToClientMap.get(orderEmail) ?? null)
            : null;

          if (
            order.customerProfile &&
            !order.customerProfile?.firstName &&
            client
          ) {
            order.customerProfile = {
              ...order.customerProfile,
              firstName: client.firstName,
              lastName: client.lastName,
            };
          }

          return {
            ...order,
            client,
          };
        });
      },
    },
  );
}
