import { axiosClient } from "@/lib/utils";
import { UserInvite } from "@/types/InviteType";
import { Role } from "@/types/UserType";

export async function getInviteById(
  inviteId: string,
): Promise<UserInvite & { valid: boolean }> {
  const axios = await axiosClient();
  const res = await axios.get("/invites/id/" + inviteId);
  return res.data as UserInvite & { valid: boolean };
}

export async function sendUserInvite(
  firstName: string,
  lastName: string,
  email: string,
  role: Role = "VOLUNTEER",
) {
  const axios = await axiosClient();
  await axios.post("/invites/send", {
    firstName,
    lastName,
    email,
    role,
  });
}
