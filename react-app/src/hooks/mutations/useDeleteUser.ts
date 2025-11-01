import { useAuth } from "@/auth/AuthProvider";
import { logOut } from "@/backend/AuthFunctions";
import { deleteUserById } from "@/backend/UserFunctions";
// import { auth } from "@/config/firebase";
import queries from "@/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { authUser } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userId: string) => deleteUserById(userId),
    onSuccess: async (_, userId) => {
      queryClient.invalidateQueries(queries.users.all);
      queryClient.invalidateQueries(queries.users.id(userId));

      // force refresh auth
      if (authUser?.uid === userId) {
        await logOut();
        navigate("/login");
      }
    },
  });
}
