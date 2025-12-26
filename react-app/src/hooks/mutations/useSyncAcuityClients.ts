import { syncAcuityClients } from "@/services/clientSyncService";
import queries from "@/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";

export function useSyncAcuityClients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => syncAcuityClients(),
    onSuccess: (result) => {
      if (result.status === "OK" && result.stats) {
        showSuccessToast(
          `Sync complete: ${result.stats.newClients} clients added, ${result.stats.updatedClients} clients updated.`,
        );
      }
    },
    onError: (err) => {
      showErrorToast("Failed to sync Acuity clients.");
      console.error(err);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queries.clients._def });
    },
  });
}
