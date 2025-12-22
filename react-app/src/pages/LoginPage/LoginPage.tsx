import { FormEvent, MouseEvent, useState, useRef, useEffect } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Logo from "../../assets/bcgw-logo.png";
import Loading from "../../components/Loading";
import { AuthError, getMultiFactorResolver, MultiFactorResolver, PhoneAuthProvider, RecaptchaVerifier, MultiFactorInfo, PhoneMultiFactorGenerator } from "firebase/auth";
import { authenticateUserEmailAndPassword } from "../../services/authService";
import ForgotPasswordPopup from "./ForgotPasswordPopup";
import TwoFAPopup from "../../components/TwoFAPopup";
import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase";
import Select2FAMethodModal from "./Select2FAMethodModal";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [openForgotModal, setOpenForgotModal] = useState<boolean>(false);
  const [open2FAModal, setOpen2FAModal] = useState<boolean>(false);
  const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);
  const [isSelect2FAModalOpen, setSelect2FAModalOpen] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => { console.log('recaptcha resolved..') }
      });
      recaptchaVerifierRef.current.render();
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const viewPassword = () => {
    setVisibility(!visibility);
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();
    setShowLoading(true);
    setError("");

    if (!email) {
      setError("Email is required.");
      setShowLoading(false);
      return;
    }
    if (!password) {
      setError("Password is required");
      setShowLoading(false);
      return;
    }
    if (!regex.test(email)) {
      setError("Please input a valid email.");
      setShowLoading(false);
      return;
    }

    authenticateUserEmailAndPassword(email, password)
      .then(() => {
        // On successful login for non-MFA user, AuthProvider will handle redirect.
        setShowLoading(false);
      })
      .catch((error) => {
        setShowLoading(false);
        const code = (error as AuthError).code;
        console.log(code)
        if (code === "auth/multi-factor-auth-required") {
          const mfaResolver = getMultiFactorResolver(auth, error);
          setResolver(mfaResolver);
          setSelect2FAModalOpen(true);
        } else if (code === "auth/too-many-requests") {
          setError(
            "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.",
          );
        } else {
          setError("Incorrect email address or password");
        }
      });
  };

  const handle2FASelection = async (hint: MultiFactorInfo) => {
    setSelect2FAModalOpen(false);
    if (!resolver || !recaptchaVerifierRef.current) {
      setError("An error occurred during 2FA setup. Please try again.");
      return;
    }

    setShowLoading(true);
    try {
      const phoneInfoOptions = {
        multiFactorHint: hint,
        session: resolver.session,
      };

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const newVerificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions,
        recaptchaVerifierRef.current
      );
      setVerificationId(newVerificationId);
      setOpen2FAModal(true);
      showSuccessToast("Verification code sent!")
    } catch (error) {
      setError("Failed to send verification code. Please try again.");
      console.error(error)
      navigate(0);
    } finally {
      setShowLoading(false);
    }
  };

  const handle2FACodeSubmit = async (verificationCode: string) => {
    if (!resolver || !verificationId) {
      setError("An error occurred. Please try again.");
      return;
    }
    setShowLoading(true);
    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await resolver.resolveSignIn(multiFactorAssertion);
      // AuthProvider will redirect on successful sign in
      setOpen2FAModal(false);
    } catch (error) {
      setError("Invalid verification code. Please try again.");
      console.error(error)
    } finally {
      setShowLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div id="recaptcha-container" />
      <div className="flex flex-col items-center mb-6">
        <img src={Logo} className="w-40 h-40 object-contain" />
        <h1>Log In</h1>
      </div>

      <form
        onSubmit={(event) => {
          if (!openForgotModal) {
            handleSubmit(event);
          }
        }}
      >
        <input // input for email
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-xs sm:w-lg px-4 py-3 border mb-4"
        />

        <div className="relative mb-2">
          <input // input for password
            type={visibility ? "text" : "password"} // ternary operator to show visibility -- password
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-xs sm:w-lg px-4 py-3 border"
          />
          <button
            type="button"
            onClick={viewPassword}
            className="absolute right-3 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            {visibility ? (
              <IoMdEyeOff className="w-5 h-5" />
            ) : (
              <IoMdEye className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          type="button"
          className="text-s hover:underline tracking-wide cursor-pointer"
          onClick={() => {
            setOpenForgotModal(true);
          }}
        >
          FORGOT PASSWORD?
        </button>

        <div className="flex justify-center mt-6">
          <Button
            variant="yellow"
            type="submit"
            className="font-bold text-lg py-6 px-18 rounded-full cursor-pointer"
            disabled={showLoading}
          >
            {showLoading ? <Loading /> : "Sign In"}
          </Button>
        </div>

        {/* error message */}
        <p
          className={
            error ? "mt-2 text-red-500 text-center" : " mt-2 invisible h-[24px]"
          }
        >
          {error}
        </p>
      </form>
      <ForgotPasswordPopup
        openModal={openForgotModal}
        onClose={() => setOpenForgotModal(false)}
      />
      <Select2FAMethodModal
        open={isSelect2FAModalOpen}
        onClose={() => setSelect2FAModalOpen(false)}
        onSelect={handle2FASelection}
        hints={resolver ? resolver.hints : []}
      />
      <TwoFAPopup
        open={open2FAModal}
        onCodeSubmit={handle2FACodeSubmit}
        disabled={showLoading}
      />
    </div>
  );
};

export default LoginPage;
