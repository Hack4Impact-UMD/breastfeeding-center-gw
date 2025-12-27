import { useCallback, useEffect } from "react";
import primaryLogo from "../assets/bcgw-logo.png";
import { Button } from "@/components/ui/button";
import { sendEmailVerification } from "firebase/auth";
import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { useAuth } from "@/auth/AuthProvider";
import { Navigate, useNavigate } from "react-router";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";
import Loading from "@/components/Loading";

export default function VerifyEmailPage() {
  const { authUser, isAuthed, loading } = useAuth();
  const navigate = useNavigate();

  const sendVerificationEmail = useCallback(async () => {
    if (!authUser) {
      showErrorToast("Not authenticated");
      return;
    }
    try {
      await sendEmailVerification(authUser);
      showSuccessToast("Verification email sent!");
    } catch (err) {
      console.error("Failed to send verification email");
      console.error(err);
      showErrorToast("Failed to send verification email!");
    }
  }, [authUser]);

  const refresh = useCallback(() => navigate(0), [navigate]);

  useEffect(() => {
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  if (loading) return <Loading />;
  if (!isAuthed) return <Navigate to="/" />;
  if (authUser?.emailVerified) return <Navigate to="/" />;

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <img
          className="h-50 w-50 object-contain"
          src={primaryLogo}
          alt="BCGW Logo"
        />
        <h2 className="font-semibold mb-2">Verify your email</h2>
        <h3>
          For security reasons, the email associated with your account must be
          verified.
        </h3>
        <p className="mb-4">
          Once the email is sent, click the link within the email and then
          refresh this page.
        </p>
        <Button onClick={sendVerificationEmail} variant={"yellow"}>
          Send verification email to {authUser?.email}
        </Button>
      </div>
    </>
  );
}
