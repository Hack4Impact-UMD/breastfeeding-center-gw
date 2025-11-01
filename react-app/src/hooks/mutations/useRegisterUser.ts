import { registerUserWithInvite } from "@/backend/UserFunctions";
import { UserRegisterForm } from "@/types/UserType";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export function useRegisterUser() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async ({
      inviteId,
      form
    }: {
      inviteId: string,
      form: UserRegisterForm
    }) => {
      await registerUserWithInvite(inviteId, form)
    },
    onSuccess: () => {
      console.log("Registration successful!")
      navigate("/login")
    },
    onError: (err) => {
      console.error("Registration failed!");
      console.error(err);
    }
  })
}
