import { createQueryKeys } from "@lukemorales/query-key-factory";

export const userQueries = createQueryKeys("users", {
  all: ["all"],
  id: (userId: string) => ["id", userId],
  current: ["current"]
});
