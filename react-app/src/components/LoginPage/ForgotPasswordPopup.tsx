/*
- Create a Forgot Password Popup (no reset password functionality)
- Refer to Figma in High Fidelity file

- If the Forgot password button is clicked on the login page, the Forgot Your Password popup will open
- Use the ModalWrapper in the Components folder as a base for the popup
    - Feel free to modify ModalWrapper as needed to fit styles
- Create new LoginPage folder and put these popup(s) and the LoginPage in this file
- The first popup should display the following:
    - Title & subtext
    - Input for Email
    - “Submit button
    - ← on the top left corner that will close out the popup
- The second popup:
    - Simply display the success title and subtext
    - `X` will close out of the popup
- To implement this popup, you can either:
    1. Simply have one popup that toggles between the information (once submit is clicked, display success information on same popup). This is the preferred method
    2. Create 2 separate popups for this
*/

import Modal from "../Modal";
import { BiArrowBack } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";


const ForgotPassword = (): React.JSX.Element => {
  // Toggle between the two popups
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClose = () => {
    console.log("Go back to login page"); // Or modal close function
  };

  // Success popup content
  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const forgotPassContent = (
    <div>
      {/* Cursor becomes pointer over the padding */}
      <button
        onClick={() => console.log("Should close out popup")}
        className="cursor-pointer p-4"
      >
        <BiArrowBack className="w-8 h-6"></BiArrowBack>
      </button>
      <div className="flex flex-col justify-center px-15">
        {/* Need to import Monsterrat into tailwind and need to center these elements properly */}
        <h1 className="text-[1.7rem] font-semibold font-Monsterrat">
          Forgot Your Password?
        </h1>
        <p className="leading-tight my-4 font-inter">
          Please enter your email address below. You will receive a link to
          create a new password.{" "}
        </p>
        <p className="font-Inter">Email Address</p>
        <input className="h-15 border-1 border-black" type="text" required />
        <button
          onClick={handleSubmit}
          className="my-4 w-3/4 h-17 cursor-pointer rounded-full bg-[#f4bb47] self-center text-[1.6rem] font-bold font-inter"
        >
          {/* Don't know what the font is used for submit */}
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
      <div className="flex flex-col justify-center px-15 text-center mt-10">
        <h1 className="text-[1.7rem] font-semibold">
          Success!
        </h1>
        <p className="leading-tight my-4 font-inter">
          Your email has been sent to reset. You will get an email back shortly!
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      open={true} // Or pass as a prop depending on your parent component
      onClose={handleClose}
      height={400}
    >
      {showSuccess ? successContent : forgotPassContent}
    </Modal>
  );
};

export default ForgotPassword;
