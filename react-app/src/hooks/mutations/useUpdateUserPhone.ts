import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";
import { auth } from "@/config/firebase";
import queries from "@/queries";
import { updateCurrentUserPhone } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useUpdateUserPhone(onSettled: () => void = () => { }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ newPhone }: { newPhone: string }) => updateCurrentUserPhone(newPhone),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queries.users._def });
      await auth.currentUser?.getIdToken(true);
      onSettled()
    },
    onSuccess() {
      showSuccessToast("Phone number updated successfully!")
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data === "reauth") {
        showErrorToast("Failed to update phone number. Reauthenticate and try again.")
      } else {
        showErrorToast("Failed to update phone number.")
      }
      console.error(err);
    }
  });
}
