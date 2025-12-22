import { useAuth } from "@/auth/AuthProvider";
import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";
import queries from "@/queries";
import { updateCurrentUserEmail } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useUpdateUserEmail(onSettled: () => void = () => { }) {
  const { refreshAuth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      oldEmail,
      newEmail,
    }: {
      oldEmail: string;
      newEmail: string;
    }) => updateCurrentUserEmail(newEmail, oldEmail),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queries.users._def });
      await refreshAuth();
      onSettled();
    },
    onSuccess() {
      showSuccessToast("Email updated successfully!");
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data === "reauth") {
        showErrorToast("Failed to update email. Reauthenticate and try again.");
      } else {
        showErrorToast("Failed to update email.");
      }
      console.error(err);
    },
  });
}
