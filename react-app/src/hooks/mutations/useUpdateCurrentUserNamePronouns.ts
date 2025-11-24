import { useAuth } from "@/auth/AuthProvider";
import { updateCurrentUserNamePronouns } from "@/services/userService";
import { auth } from "@/config/firebase";
import queries from "@/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCurrentUserNamePronouns() {
  const queryClient = useQueryClient();
  const { authUser } = useAuth();

  return useMutation({
    mutationFn: (variables: {
      firstName: string;
      lastName: string;
      pronouns: string | null;
    }) =>
      updateCurrentUserNamePronouns(
        variables.firstName,
        variables.lastName,
        variables.pronouns,
      ),
    onSuccess: async () => {
      queryClient.invalidateQueries(queries.users.all);
      if (authUser?.uid) {
        queryClient.invalidateQueries(queries.users.id(authUser.uid));
      }

      // force refresh auth
      await auth.currentUser?.getIdToken(true);
    },
  });
}
