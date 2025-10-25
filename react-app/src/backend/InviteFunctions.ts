import { axiosClient } from "@/lib/utils";
import { UserInvite } from "@/types/InviteType";

export async function getInviteById(inviteId: string): Promise<UserInvite> {
  const axios = await axiosClient();
  const res = await axios.get("/invites/id/" + inviteId);
  return res.data as UserInvite
}
