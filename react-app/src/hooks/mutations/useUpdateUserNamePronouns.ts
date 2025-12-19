import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";
import queries from "@/queries";
import { updateCurrentUserNamePronouns } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserEmail(onSettled: () => void = () => { }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ firstName, lastName, pronouns }: { firstName: string, lastName: string, pronouns: string | null }) => updateCurrentUserNamePronouns(firstName, lastName, pronouns),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queries.users._def });
      onSettled()
    },
    onSuccess() {
      showSuccessToast("Profile updated successfully!")
    },
    onError: (err) => {
      showErrorToast("Failed to update profile.")
      console.error(err);
    }
  });
}
