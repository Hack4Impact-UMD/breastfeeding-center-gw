import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";
import queries from "@/queries";
import { syncBooqableClients } from "@/services/clientSyncService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSyncBooqableClients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => syncBooqableClients(),
    onSuccess: (result) => {
      if (result.status === "OK" && result.stats) {
        showSuccessToast(
          `Sync complete: ${result.stats.newClients} clients added, ${result.stats.updatedClients} clients updated.`,
        );
      }
    },
    onError: (err) => {
      showErrorToast("Failed to sync Booqable clients.");
      console.error(err);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queries.clients._def });
    },
  });
}
