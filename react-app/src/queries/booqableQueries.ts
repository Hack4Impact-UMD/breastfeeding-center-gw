import { Client } from "@/types/ClientType";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const booqableQueries = createQueryKeys("booqable", {
  rentals: (startDate: string, endDate: string) => ["rentals", "range", startDate, endDate],
  rentalsForClients: (clients: Client[]) => ["rentals", "clients", clients.map(c => c.email)],
});
