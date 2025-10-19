import { getAllUsers } from "@/backend/UserFunctions";
import queries from "@/queries";
import { User } from "@/types/UserType";
import { useQuery } from "@tanstack/react-query";

export function useAllUsers() {
  return useQuery<User[]>({
    ...queries.users.all,
    queryFn: getAllUsers
  })
}
