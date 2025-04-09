import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Logo from "../../assets/bcgw-logo.png";
import Loading from "../../components/Loading";
import { AuthError } from "firebase/auth";
import { authenticateUserEmailAndPassword } from "../../backend/AuthFunctions";
import ForgotPasswordPopup from "./ForgotPasswordPopup";
import { useNavigate } from "react-router-dom";
import TwoFAPopup from "../../components/TwoFAPopup";

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

  const viewPassword = () => {
    setVisibility(!visibility);
  };

  // Email and Password inputs have required, so handleSubmit
  // only handles validity of email
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setShowLoading(true);

    let emailValid = true;
    let passwordValid = true;

    if (!email) {
      setError("Email is required.");
      emailValid = false;
    } else if (!password) {
      setError("Password is required");
      passwordValid = false;
    } else if (!regex.test(email)) {
      setError("Please input a valid email.");
      emailValid = false;
    }

    if (emailValid && passwordValid) {
      authenticateUserEmailAndPassword(email, password)
        .then(() => {
          setShowLoading(false);
          setOpen2FAModal(true);
          // TODO: SET 2FA LOGIC
          navigate("/");
        })
        .catch((error) => {
          setShowLoading(false);
          const code = (error as AuthError).code;
          if (code === "auth/too-many-requests") {
            setError(
              "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later."
            );
          } else {
            setError("Incorrect email address or password");
          }
        });
    }
    setShowLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="flex flex-col items-center mb-6">
        <img src={Logo} className="w-40 h-40 object-contain" />
        <h1>Log In</h1>
      </div>

      <form
        onSubmit={(event) => {
          if (!openForgotModal) {
            handleSubmit(event);
          }
        }}>
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
            className="absolute right-3 top-4 text-gray-500 hover:text-gray-700 cursor-pointer">
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
          }}>
          FORGOT PASSWORD?
        </button>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            className="bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light font-bold text-lg py-4 px-18 rounded-full cursor-pointer">
            {showLoading ? <Loading /> : "Sign In"}
          </button>
        </div>

        {/* error message */}
        <p
          className={
            error ? "mt-2 text-red-500 text-center" : " mt-2 invisible h-[24px]"
          }>
          {error}
        </p>
      </form>
      <ForgotPasswordPopup
        openModal={openForgotModal}
        onClose={() => setOpenForgotModal(false)}
      />
      <TwoFAPopup
        openModal={open2FAModal}
        onClose={() => setOpen2FAModal(false)}
      />
    </div>
  );
};

export default LoginPage;
