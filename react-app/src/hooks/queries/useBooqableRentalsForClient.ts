import { useQuery } from "@tanstack/react-query";
import queries from "@/queries";
import { Client } from "@/types/ClientType";
import { BooqableRental, getAllBooqableRentalsForClientById, getAllBooqableRentalsForClientByEmail } from "@/services/booqableService";

export function useBooqableRentalsForClients(clients: Client[]) {
  return useQuery<BooqableRental[]>({
    ...queries.booqable.rentalsForClients(clients),
    queryFn: async (): Promise<BooqableRental[]> => {
      const rentals = await Promise.all(
        clients.map((client) => {
          if (client.stripeId) {
            return getAllBooqableRentalsForClientById(client.stripeId);
          } else {
            return getAllBooqableRentalsForClientByEmail(client.email);
          }
        }),
      );

      return rentals.flatMap(orders => [...orders])
    },
    enabled: !!clients && clients.length > 0, // Only fetch if email exists
  });
}
