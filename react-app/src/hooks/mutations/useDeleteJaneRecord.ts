import { deleteJaneByIds } from "@/backend/FirestoreCalls";
import { JaneTableRow } from "@/types/JaneType";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteJaneRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rows: JaneTableRow[]) => {
      const ids = rows.map((entry) => entry.apptId);
      await deleteJaneByIds(ids);
    },
    onMutate: async (rows) => {
      await queryClient.cancelQueries({ queryKey: ["janeData"] });

      const prevData = queryClient.getQueryData<JaneTableRow[]>(["janeData"]);

      // optimistic update
      queryClient.setQueryData<JaneTableRow[]>(
        ["janeData"],
        (old) =>
          old?.filter((d) => !rows.map((x) => x.id).includes(d.id)) ?? [],
      );

      return { prevData };
    },
    onError: (err, _, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(["janeData"], ctx.prevData);
      }
      console.error("failed to delete jane records:");
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["janeData"] });
    },
  });
}
