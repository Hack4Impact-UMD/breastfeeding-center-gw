import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "../../components/Modal";
import ChangeEmailPopup from "./ChangeEmailPopup";
import ChangePhoneNumberPopup from "./ChangePhoneNumberPopup";
import ChangePasswordPopup from "./ChangePasswordPopup";
import { Button } from "@/components/ui/button";

const ConfirmPasswordPopup = ({
  open,
  onClose,
  editType,
  email,
  phone,
}: {
  open: boolean;
  onClose: any;
  editType: string;
  email: string;
  phone: string;
}) => {
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  //@ts-expect-error
  const [currentPassword, setCurrentPassword] = useState("abc");
  const [showIncorrectPassword, setShowIncorrectPassword] = useState(false);
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const handleOnClose = () => {
    onClose();
    setCurrentPasswordInput("");
    setShowIncorrectPassword(false);
  };

  const handleNextFromCurrent = () => {
    if (currentPasswordInput === currentPassword) {
      if (editType == "Email") {
        setOpenEmailModal(true);
      } else if (editType == "Phone") {
        setOpenPhoneModal(true);
      } else {
        setOpenPasswordModal(true);
      }
      handleOnClose();
    } else {
      setShowIncorrectPassword(true);
      setCurrentPasswordInput("");
    }
  };

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center my-2 mx-4">
        <p className="text-lg">
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
        <div className="flex flex-col h-full">
          <div>
            <ModalHeader
              onClose={() => {
                handleOnClose();
              }}
            />
            <div className="grid grid-cols-[190px_1fr] m-8 mb-2 gap-x-2 text-left">
              <label className="text-md font-medium text-nowrap content-center">
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
                className="w-full border-[1.5px] border-black px-2 py-2"
                placeholder="Current password"
              />
              <div className="h-[20px]"></div>
              {showIncorrectPassword && (
                <p className="text-red-600 text-sm">Password is incorrect</p>
              )}
            </div>
          </div>
          <div className="flex justify-end m-8 mt-0">
            <Button
              variant={"yellow"}
              className="py-4 px-6 text-md"
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
        initialPhone={phone}
      />
      <ChangeEmailPopup
        open={openEmailModal}
        onClose={() => setOpenEmailModal(false)}
        initialEmail={email}
      />
      <ChangePasswordPopup
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      />
    </>
  );
};

export default ConfirmPasswordPopup;
