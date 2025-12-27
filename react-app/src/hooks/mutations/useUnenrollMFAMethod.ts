import { useAuth } from "@/auth/AuthProvider";
import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";
import { useMutation } from "@tanstack/react-query";
import { multiFactor, MultiFactorInfo } from "firebase/auth";

export function useUnenrollMFAMethod() {
  const { authUser, refreshAuth } = useAuth();
  return useMutation({
    mutationFn: async (method: MultiFactorInfo) => {
      if (!authUser) throw new Error("Not authenticated");
      const multiFactorUser = multiFactor(authUser);
      await multiFactorUser.unenroll(method);
    },
    onSuccess: async () => {
      await refreshAuth();
      showSuccessToast("MFA method successfully unenrolled!");
    },
    onError: (err) => {
      console.error("Failed to unenroll mfa method:");
      console.error(err);
      showErrorToast("Failed to unenroll MFA method!");
    },
  });
}
