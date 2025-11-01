import { useAuth } from "@/auth/AuthProvider";
import { updateUserRole } from "@/backend/UserFunctions";
import { auth } from "@/config/firebase";
import queries from "@/queries";
import { Role } from "@/types/UserType";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { authUser } = useAuth()

  return useMutation({
    mutationFn: (variables: { id: string; role: Role }) =>
      updateUserRole(variables.id, variables.role),
    onSuccess: async (_, { id }) => {
      queryClient.invalidateQueries(queries.users.all);
      queryClient.invalidateQueries(queries.users.id(id));

      // force refresh auth
      if (authUser?.uid === id) {
        await auth.currentUser?.getIdToken(true)
      }
    },
  });
}
