import { useAuth } from "@/auth/AuthProvider";
import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";
import queries from "@/queries";
import { updateCurrentUserNamePronouns } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserNamePronouns(onSettled: () => void = () => {}) {
  const queryClient = useQueryClient();
  const { refreshAuth } = useAuth();

  return useMutation({
    mutationFn: ({
      firstName,
      lastName,
      pronouns,
    }: {
      firstName: string;
      lastName: string;
      pronouns: string | null;
    }) => updateCurrentUserNamePronouns(firstName, lastName, pronouns),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queries.users._def });

      await refreshAuth();
      onSettled();
    },
    onSuccess() {
      showSuccessToast("Profile updated successfully!");
    },
    onError: (err) => {
      showErrorToast("Failed to update profile.");
      console.error(err);
    },
  });
}
