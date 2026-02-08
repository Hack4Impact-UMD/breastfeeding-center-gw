import { useQuery } from "@tanstack/react-query";
import queries from "@/queries";
import { Client } from "@/types/ClientType";
import { getAllSquarespaceOrdersForClientByEmail, getAllSquarespaceOrdersForClientById, SquarespaceOrder } from "@/services/squarespaceService";

export function useSquarespaceOrdersForClients(clients: Client[]) {
  return useQuery<SquarespaceOrder[]>({
    ...queries.squarespaceData.ordersForClients(clients),
    queryFn: async (): Promise<SquarespaceOrder[]> => {
      const orders = await Promise.all(
        clients.map((client) => {
          if (client.squarespaceCustomerId) {
            return getAllSquarespaceOrdersForClientById(client.squarespaceCustomerId);
          } else {
            return getAllSquarespaceOrdersForClientByEmail(client.email);
          }
        }),
      );

      return orders.flatMap(orders => [...orders])
    },
    enabled: !!clients && clients.length > 0, // Only fetch if email exists
  });
}
