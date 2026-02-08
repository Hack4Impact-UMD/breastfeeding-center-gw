import { Client } from "@/types/ClientType";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const squarespaceQueries = createQueryKeys("squarespaceData", {
  ordersForClient: (email: string) => ["orders", "client", email],
  ordersForClients: (clients: Client[]) => ["orders", "clients", clients.map(c => c.email)],
});
