import { deleteUserById } from "@/backend/UserFunctions";
import queries from "@/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteUserById(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(queries.users.all);
    },
  });
}
