import { getInviteById } from "@/services/inviteService";
import queries from "@/queries";
import { UserInvite } from "@/types/InviteType";
import { useQuery } from "@tanstack/react-query";

export function useInvite(inviteId: string) {
  return useQuery<UserInvite & { valid: boolean }>({
    ...queries.invites.id(inviteId),
    queryFn: () => getInviteById(inviteId),
  });
}
