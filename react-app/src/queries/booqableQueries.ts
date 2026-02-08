import { Client } from "@/types/ClientType";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const booqableQueries = createQueryKeys("booqable", {
  rentalsForClients: (clients: Client[]) => ["rentals", "clients", clients.map(c => c.email)],
});
