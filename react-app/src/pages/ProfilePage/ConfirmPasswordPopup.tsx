import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "../../components/Modal";
import ChangeEmailPopup from "./ChangeEmailPopup";
import ChangePhoneNumberPopup from "./ChangePhoneNumberPopup";
import ChangePasswordPopup from "./ChangePasswordPopup";
import { Button } from "@/components/ui/button";
import { reauthenticateUser } from "@/services/authService";
import { FirebaseError } from "firebase/app";

const ConfirmPasswordPopup = ({
  open,
  onClose,
  editType,
}: {
  open: boolean;
  onClose: () => void;
  editType: "Email" | "Phone" | "Password";
}) => {
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const handleOnClose = () => {
    onClose();
    setCurrentPasswordInput("");
    setErrorMessage("");
  };

  const handleNextFromCurrent = async () => {
    try {
      await reauthenticateUser(currentPasswordInput);
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/wrong-password") {
          setErrorMessage("Incorrect password.");
          setCurrentPasswordInput("");
        } else if (err.code === "auth/too-many-attempts") {
          setErrorMessage("Too many failed attempts.");
          setCurrentPasswordInput("");
        } else {
          setCurrentPasswordInput("");
          setErrorMessage("Failed to authenticate.");
        }
      } else {
        setCurrentPasswordInput("");
        setErrorMessage("Something went wrong. Try again later.");
      }
      console.error(err);
      return;
    }

    if (editType == "Email") {
      setOpenEmailModal(true);
    } else if (editType == "Phone") {
      setOpenPhoneModal(true);
    } else {
      setOpenPasswordModal(true);
    }
    handleOnClose();
  };

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center my-2 mx-4">
        <p className="text-base sm:text-lg">
          {editType == "Email"
            ? "Change Email"
            : editType == "Phone"
              ? "Change Phone Number"
              : "Change Password"}
        </p>
        <IoIosClose
          className="text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
          onClick={onClose}
          size={32}
        />
      </div>
      <div className="w-full h-[1.5px] bg-black" />
    </>
  );

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          handleOnClose();
        }}
        height={220}
        width={500}
      >
        <div className="flex flex-col bg-white rounded-2xl w-full">
          <ModalHeader
            onClose={() => {
              handleOnClose();
            }}
          />

          <div className="flex flex-col m-4 sm:m-8 mb-2 text-left">
            {/* Current Password Input */}
            <div className="flex flex-col sm:grid sm:grid-cols-[190px_1fr] sm:gap-x-2">
              <label className="text-sm sm:text-base font-medium mb-1 sm:mb-0 text-nowrap sm:content-center">
                Enter Current Password:
              </label>
              <input
                type="password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                onKeyDown={(event) => {
                  if (currentPasswordInput && event.key === "Enter") {
                    event.preventDefault();
                    handleNextFromCurrent();
                  }
                }}
                className="w-full border-[1.5px] border-black px-3 py-2 text-sm sm:text-base"
                placeholder="Current password"
              />
            </div>

            {/* Error message - only show when there's an error */}
            {errorMessage.length > 0 && (
              <div className="sm:grid sm:grid-cols-[190px_1fr] sm:gap-x-2 mt-1">
                <div className="hidden sm:block"></div>
                <p className="text-red-600 text-xs sm:text-sm">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center sm:justify-end mx-4 sm:mx-8 mb-4 sm:mb-8">
            <Button
              variant={"yellow"}
              className="w-full sm:w-auto py-4 px-6 text-sm sm:text-base"
              disabled={!currentPasswordInput}
              onClick={handleNextFromCurrent}
            >
              Next
            </Button>
          </div>
        </div>
      </Modal>

      <ChangePhoneNumberPopup
        open={openPhoneModal}
        onClose={() => setOpenPhoneModal(false)}
      />
      <ChangeEmailPopup
        open={openEmailModal}
        onClose={() => setOpenEmailModal(false)}
      />
      <ChangePasswordPopup
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      />
    </>
  );
};

export default ConfirmPasswordPopup;
