import { axiosClient } from "@/lib/utils";
import { User } from "@/types/UserType";

export async function getAllUsers(): Promise<User[]> {
  const axios = await axiosClient()
  const res = await axios.get("/users/all")
  return res.data as User[]
}
