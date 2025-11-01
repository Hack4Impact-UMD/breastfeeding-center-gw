import { updateUserRole } from "@/backend/UserFunctions";
import queries from "@/queries";
import { Role } from "@/types/UserType";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; role: Role }) =>
      updateUserRole(variables.id, variables.role),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(queries.users.all);
      queryClient.invalidateQueries(queries.users.id(id));
    },
  });
}
