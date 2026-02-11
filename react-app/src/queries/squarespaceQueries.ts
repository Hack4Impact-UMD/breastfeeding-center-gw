import { Client } from "@/types/ClientType";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const squarespaceQueries = createQueryKeys("squarespaceData", {
  orders: (startDate?: string, endDate?: string) => [
    "orders",
    startDate,
    endDate,
  ],
  ordersForClient: (email: string) => ["orders", "client", email],
  ordersForClients: (clients: Client[]) => [
    "orders",
    "clients",
    clients.map((c) => c.email),
  ],
});
