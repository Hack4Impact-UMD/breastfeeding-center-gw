import { getInviteById } from "@/backend/InviteFunctions";
import queries from "@/queries";
import { useQuery } from "@tanstack/react-query";

export function useInvite(inviteId: string) {
  return useQuery({
    ...queries.invites.id(inviteId),
    queryFn: () => getInviteById(inviteId)
  })
}
