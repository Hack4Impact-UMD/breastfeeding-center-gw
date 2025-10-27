import { createQueryKeys } from "@lukemorales/query-key-factory";

export const inviteQueries = createQueryKeys("invites", {
  id: (inviteId: string) => ["id", inviteId],
});
