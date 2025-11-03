import { useAuth } from "@/auth/AuthProvider";
import { getAllUsers, getUserById } from "@/services/userService";
import queries from "@/queries";
import { User } from "@/types/UserType";
import { useQuery } from "@tanstack/react-query";

export function useAllUsers() {
  return useQuery<User[]>({
    ...queries.users.all,
    queryFn: getAllUsers,
  });
}

export function useCurrentUser() {
  const { authUser: user } = useAuth();
  return useQuery<User>({
    ...queries.users.current,
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      return await getUserById(user.uid);
    },
  });
}
