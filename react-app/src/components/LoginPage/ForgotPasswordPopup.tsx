import Modal from "../Modal";
import { BiArrowBack } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";

const ForgotPassword = (): React.JSX.Element => {
  // Toggle between the two popups
  const [showSuccess, setShowSuccess] = useState(false);
  // Popup openned or closed
  const [openModal, setOpenModal] = useState(true);

  const handleClose = () => {
    setOpenModal(false);
  };

  // Success popup content
  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const forgotPassContent = (
    <div>
      {/* Cursor becomes pointer over the padding */}
      <button onClick={handleClose} className="cursor-pointer p-4">
        <BiArrowBack className="w-8 h-6"></BiArrowBack>
      </button>
      <div className="flex flex-col justify-center px-15">
        {/* Need to import Monsterrat into tailwind possibly with config file if doesn't work on other locals */}
        <h1 className="text-[1.7rem] font-semibold font-Monsterrat">
          Forgot Your Password?
        </h1>
        <p className="leading-tight my-4 font-inter">
          Please enter your email address below. You will receive a link to
          create a new password.{" "}
        </p>
        <p className="font-Inter">Email Address</p>
        <input
          className="h-15 border-1 border-black p-2"
          type="text"
          required
        />
        <button
          onClick={handleSubmit}
          className="my-4 w-3/4 h-17 cursor-pointer rounded-full bg-[#f4bb47] self-center text-[1.6rem] font-bold font-inter"
        >
          Submit
        </button>
      </div>
    </div>
  );

  const successContent = (
    <div>
      <button
        onClick={handleClose}
        className="cursor-pointer p-4 absolute top-0 right-0"
      >
        <RxCross2 className="w-6 h-6" />
      </button>
      <div className="flex flex-col justify-center px-15 text-center mt-15">
        <h1 className="text-[1.7rem] font-semibold">Success!</h1>
        <p className="leading-tight my-4 font-inter">
          Your email has been sent to reset. You will get an email back shortly!
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      height={showSuccess ? 240 : 400}
    >
      {showSuccess ? successContent : forgotPassContent}
    </Modal>
  );
};

export default ForgotPassword;
