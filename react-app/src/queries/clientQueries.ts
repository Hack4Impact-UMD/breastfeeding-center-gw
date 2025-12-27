import { createQueryKeys } from "@lukemorales/query-key-factory";

export const clientQueries = createQueryKeys("clients", {
  all: () => ["all"],
  clientListRows: () => ["clientListRows"],
  id: (id: string) => ["id", id],
});
