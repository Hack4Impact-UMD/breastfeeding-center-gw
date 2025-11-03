import { deleteJaneApptsByIds } from "@/services/janeService";
import queries from "@/queries";
import { JaneTableRow } from "@/types/JaneType";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteJaneRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      rows,
    }: {
      startDate?: string;
      endDate?: string;
      rows: JaneTableRow[];
    }) => {
      const ids = rows.map((entry) => entry.apptId);
      await deleteJaneApptsByIds(ids);
    },
    onMutate: async ({ rows, startDate, endDate }) => {
      await queryClient.cancelQueries({
        queryKey: queries.janeData.uploadedDataTable._def,
      });

      const prevData = queryClient.getQueryData<JaneTableRow[]>(
        queries.janeData.uploadedDataTable(startDate, endDate).queryKey,
      );

      // optimistic update
      queryClient.setQueryData<JaneTableRow[]>(
        queries.janeData.uploadedDataTable(startDate, endDate).queryKey,
        (old) =>
          old?.filter((d) => !rows.map((x) => x.id).includes(d.id)) ?? [],
      );

      return { prevData };
    },
    onError: (err, { startDate, endDate }, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(
          queries.janeData.uploadedDataTable(startDate, endDate).queryKey,
          ctx.prevData,
        );
      }
      console.error("failed to delete jane records:");
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queries.janeData._def });
    },
  });
}
