import { deleteJaneByIds } from "@/backend/FirestoreCalls";
import { JaneID } from "@/types/JaneType";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteJaneRecord() {
  return useMutation({
    mutationFn: async (rows: JaneID[]) => {
      const ids = rows.map((entry) => entry.id);
      await deleteJaneByIds(ids);
    },
    onSuccess: () => {
      const queryClient = useQueryClient();
      queryClient.invalidateQueries({ queryKey: ["janeData"] });
    },
  });
}
