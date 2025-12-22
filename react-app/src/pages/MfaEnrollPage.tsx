import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/config/firebase";
import primaryLogo from "../assets/bcgw-logo.png";
import { useAuth } from "@/auth/AuthProvider";
import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { initRecaptchaVerifier, isMfaEnrolled, logOut } from "@/services/authService";
import { Navigate } from "react-router";
import Loading from "@/components/Loading";
import EnterPhoneNumberModal from "./MfaEnrollPage/EnterPhoneNumberModal";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";
import TwoFAPopup from "@/components/TwoFAPopup";
import { updateCurrentUserPhone } from "@/services/userService";
import { showWarningToast } from "@/components/Toasts/WarningToast";
import { needsReauth } from "@/lib/authUtils";

export default function MfaEnrollPage() {
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const { authUser, loading, isAuthed } = useAuth();
  const [isPhoneModalOpen, setPhoneModalOpen] = useState(false);
  const [isCodeModalOpen, setCodeModalOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [mfaDisplayName, setMfaDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = initRecaptchaVerifier();
    }

    return () => {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const handleEnrollClick = () => {
    setPhoneModalOpen(true);
  };

  const handlePhoneNumberSubmit = useCallback(async (phoneNumber: string, displayName: string) => {
    if (!authUser) {
      showErrorToast("Not authenticated!");
      return;
    }
    const verifier = recaptchaVerifierRef.current;
    if (!verifier) {
      showErrorToast("Recaptcha verifier not initialized. Please refresh.");
      return;
    }

    if (await needsReauth()) {
      showWarningToast("Enrollment took too long. You need to log back in.");
      logOut();
      return;
    }

    setIsEnrolling(true);
    try {
      const mfaSession = await multiFactor(authUser).getSession();
      const phoneInfoOptions = {
        phoneNumber,
        session: mfaSession,
      };

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const newVerificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, verifier);
      await updateCurrentUserPhone(phoneNumber);

      setVerificationId(newVerificationId);
      setMfaDisplayName(displayName);
      setPhoneModalOpen(false);
      setCodeModalOpen(true);
      showSuccessToast("Verification code sent!");
    } catch (error) {
      console.error("Error sending verification code:", error);
      showErrorToast("Failed to send verification code. Please try again.");
    } finally {
      setIsEnrolling(false);
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = initRecaptchaVerifier();
    }
  }, [authUser]);

  const handleVerificationCodeSubmit = useCallback(async (verificationCode: string) => {
    if (!authUser || !verificationId || !mfaDisplayName) {
      showErrorToast("An error occurred. Please start over.");
      setCodeModalOpen(false);
      return;
    }
    setIsEnrolling(true);
    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await multiFactor(authUser).enroll(multiFactorAssertion, mfaDisplayName);
      showSuccessToast("2FA enrolled successfully!");
      setIsEnrolling(false);
    } catch (error) {
      console.error("Error verifying code:", error);
      showErrorToast("Invalid verification code. Please try again.");
      setIsEnrolling(false);
    }
  }, [authUser, verificationId, mfaDisplayName]);

  if (loading) return <Loading />;
  if (!isAuthed || !authUser) return <Navigate to="/" />;
  if (isMfaEnrolled(authUser!)) return <Navigate to="/" />;


  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <img
          className="h-50 w-50 object-contain"
          src={primaryLogo}
          alt="BCGW Logo"
        />
        <h2 className="font-semibold mb-2">Enroll in 2-Factor Authentication</h2>
        <h3 className="mb-8">For security reasons, your account must be enrolled in SMS 2FA.</h3>
        <Button variant="yellow" onClick={handleEnrollClick} disabled={isEnrolling}>
          {isEnrolling ? "Enrolling..." : "Enroll in 2FA"}
        </Button>
      </div>

      <EnterPhoneNumberModal
        open={isPhoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        onSubmit={handlePhoneNumberSubmit}
        authUser={authUser}
        isPending={isEnrolling}
      />

      <TwoFAPopup
        open={isCodeModalOpen}
        onCodeSubmit={handleVerificationCodeSubmit}
        disabled={isEnrolling}
      />
    </>
  );
}
