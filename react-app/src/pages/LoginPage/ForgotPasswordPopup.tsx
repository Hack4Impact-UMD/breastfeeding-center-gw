import Modal from "../../components/Modal";
import { BiArrowBack } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
import { useState } from "react";
import { sendResetEmail } from "../../services/authService";
import Loading from "../../components/Loading";

const ForgotPasswordPopup = ({
  openModal,
  onClose,
}: {
  openModal: boolean;
  onClose: () => void;
}): React.JSX.Element => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Toggle between the two popups
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState<boolean>(false);

  // Success popup content
  const handleSubmit = () => {
    setShowLoading(true);
    if (email) {
      if (!regex.test(email)) {
        setError("Please input a valid email.");
      } else {
        sendResetEmail(email)
          .then(() => {
            setShowSuccess(true);
          })
          .catch(() => {
            setError("Failed to send email.");
          })
          .finally(() => {
            setShowLoading(false);
          });
      }
    } else {
      setError("Email is required.");
    }
    setShowLoading(false);
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setShowSuccess(false);
    onClose();
  };

  const forgotPassContent = (
    <div>
      {/* Cursor becomes pointer over back button */}
      <button onClick={handleClose} className="cursor-pointer m-4">
        <BiArrowBack className="w-8 h-6 text-bcgw-blue-dark" />
      </button>
      <div className="flex flex-col justify-center px-15">
        <h2 className="font-semibold">Forgot Your Password?</h2>
        <p className="leading-tight my-4">
          Please enter your email address below. You will receive a link to
          reset your password.
        </p>
        <p>Email Address</p>
        <input
          className="py-4 border-1 border-black p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          required
        />
        <button
          onClick={handleSubmit}
          className="mt-4 px-18 py-4 cursor-pointer rounded-full bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light self-center text-lg font-bold"
        >
          {showLoading ? <Loading /> : "Submit"}
        </button>
        {/* error message */}
        <p
          className={
            error ? "mt-2 text-red-500 text-center" : "mt-2 invisible h-[24px]"
          }
        >
          {error}
        </p>
      </div>
    </div>
  );

  const successContent = (
    <div>
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-bcgw-blue-dark hover:text-gray-600 z-10 cursor-pointer"
      >
        <IoIosClose size={50} />
      </button>
      <div className="relative p-8 flex flex-col items-center justify-center text-center h-full">
        <h2 className="font-semibold mt-3">Success</h2>
        <p className="my-3">Please check your email to reset your password.</p>
      </div>
    </div>
  );

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      height={showSuccess ? 175 : 380}
      width={475}
    >
      {showSuccess ? successContent : forgotPassContent}
    </Modal>
  );
};

export default ForgotPasswordPopup;
