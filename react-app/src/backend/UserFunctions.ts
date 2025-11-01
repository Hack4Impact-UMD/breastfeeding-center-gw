import { axiosClient } from "@/lib/utils";
import { Role, User, UserRegisterForm } from "@/types/UserType";

export async function getAllUsers(): Promise<User[]> {
  const axios = await axiosClient();
  const res = await axios.get("/users/all");
  return res.data as User[];
}

export async function deleteUserById(id: string) {
  const axios = await axiosClient();
  await axios.delete("/users/id/" + id);
}

export async function updateCurrentUserEmail(
  newEmail: string,
  oldEmail: string,
) {
  const axios = await axiosClient();
  await axios.put("/users/me/email", {
    newEmail,
    oldEmail,
  });
}

export async function updateUserRole(id: string, role: Role) {
  const axios = await axiosClient();
  await axios.put(`/users/id/${id}/role`, {
    role,
  });
}

export async function getUserById(id: string): Promise<User> {
  const axios = await axiosClient();
  const res = await axios.get(`/users/id/${id}`);

  return res.data as User;
}

export async function registerUserWithInvite(
  inviteId: string,
  form: UserRegisterForm,
) {
  const axios = await axiosClient();

  await axios.post(`/auth/register/invite/${inviteId}`, form);
}
