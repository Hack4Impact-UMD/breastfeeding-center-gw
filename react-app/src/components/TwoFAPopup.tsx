import Modal from "./Modal";
import { BiArrowBack } from "react-icons/bi";
import { useState } from "react";

const TwoFAPopup = (): React.JSX.Element => {
  // Toggle between the two popups
  const [showSuccess, setShowSuccess] = useState(false);
  // Popup opened or closed
  const [openModal, setOpenModal] = useState(true);

  const handleClose = () => {
    setOpenModal(false);
  };

  // Success popup content
  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleResendCode = () => {
    console.log("Resent code!");
  };

  const forgotPassContent = (
    <div>
      <button onClick={handleClose} className="cursor-pointer p-4">
        <BiArrowBack className="w-10 h-8"></BiArrowBack>
      </button>
      <div className="flex flex-col justify-center px-15">
        <p className="my-6 text-[2.5rem] font-semibold text-center font-Monsterrat">
          Two-Factor Authentication
        </p>
        <input
          className="h-15 border-1 border-black p-2"
          type="text"
          required
        />
        <p className="leading-6 font-Inter text-[1.2rem] text-center p-8">
          A message with a verification code has been <br /> sent to your phone.
          Enter the code to continue.
        </p>
        <button
          onClick={handleSubmit}
          className="w-1/2 h-22 cursor-pointer rounded-full bg-[#D9D9D9] self-center text-[2rem] font-semibold font-inter"
        >
          Submit
        </button>
        <p className="leading-6 font-Inter text-[1.2rem] text-[#1239BB] text-center p-8">
          Didn't get a verification code? <br />
          <button
            onClick={handleResendCode}
            className="underline text-[#1239BB] hover:opacity-80 transition cursor-pointer"
          >
            Resend a new code
          </button>
        </p>
      </div>
    </div>
  );

  return (
    <Modal open={openModal} onClose={handleClose} height={600} width={700}>
      {forgotPassContent}
    </Modal>
  );
};

export default TwoFAPopup;
