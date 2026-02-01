import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";
import queries from "@/queries";
import { syncSquarespaceClients } from "@/services/clientSyncService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSyncSquarespaceClients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => syncSquarespaceClients(),
    onSuccess: (result) => {
      if (result.status === "OK" && result.stats) {
        showSuccessToast(
          `Sync complete: ${result.stats.newClients} clients added, ${result.stats.updatedClients} clients updated.`,
        );
      }
    },
    onError: (err) => {
      showErrorToast("Failed to sync Squarespace clients.");
      console.error(err);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queries.clients._def });
    },
  });
}
