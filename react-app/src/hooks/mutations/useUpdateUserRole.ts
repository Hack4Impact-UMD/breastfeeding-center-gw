import { useAuth } from "@/auth/AuthProvider";
import { updateUserRole } from "@/services/userService";
import queries from "@/queries";
import { Role } from "@/types/UserType";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { authUser, refreshAuth } = useAuth();

  return useMutation({
    mutationFn: (variables: { id: string; role: Role }) =>
      updateUserRole(variables.id, variables.role),
    onSuccess: async (_, { id }) => {
      queryClient.invalidateQueries(queries.users.all);
      queryClient.invalidateQueries(queries.users.id(id));

      // force refresh auth
      if (authUser?.uid === id) {
        await refreshAuth();
      }
    },
  });
}
