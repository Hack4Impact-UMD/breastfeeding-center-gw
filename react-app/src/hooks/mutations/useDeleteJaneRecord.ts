import { deleteJaneByIds } from "@/backend/FirestoreCalls";
import { JaneID } from "@/types/JaneType";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteJaneRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rows: JaneID[]) => {
      const ids = rows.map((entry) => entry.id);
      await deleteJaneByIds(ids);
    },
    onMutate: async (rows) => {
      await queryClient.cancelQueries({ queryKey: ["janeData"] });

      // optimistic update
      queryClient.setQueryData<JaneID[]>(["janeData"], old => old?.filter(d => !rows.map(x => x.id).includes(d.id)) ?? [])
    },
    onError: (err) => {
      console.error("failed to delete jane records:");
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["janeData"] });
    },
  });
}
