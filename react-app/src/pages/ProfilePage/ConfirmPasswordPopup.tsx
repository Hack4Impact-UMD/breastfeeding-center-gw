import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "../../components/Modal";
import ChangeEmailPopup from "./ChangeEmailPopup";
import ChangePasswordPopup from "./ChangePasswordPopup";

const ConfirmPasswordPopup = ({
  open,
  onClose,
  editType,
  email,
}: {
  open: boolean;
  onClose: any;
  editType: string;
  email: string;
}) => {
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  //@ts-expect-error
  const [currentPassword, setCurrentPassword] = useState("abc");
  const [showIncorrectPassword, setShowIncorrectPassword] = useState(false);
  const [openEmailModal, setOpenEmailModal] = useState(false);
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
      <div className="flex justify-between items-center m-2">
        <p className="text-lg">
          {editType == "Email" ? "Change Email" : "Change Password"}
        </p>
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-0.25 right-0.25 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer">
          <IoIosClose size={45} />
        </button>
      </div>
      <div className="w-full h-px bg-bcgw-gray-dark my-2" />
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
        width={500}>
        <div className="flex flex-col h-full">
          <div>
            <ModalHeader
              onClose={() => {
                handleOnClose();
              }}
            />
            <div className="grid grid-cols-[190px_1fr] m-8 mb-2 gap-x-2">
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
            <button
              className={`px-6 py-2 rounded-lg border border-black text-black ${
                !currentPasswordInput
                  ? "bg-bcgw-gray-light cursor-not-allowed"
                  : "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light cursor-pointer"
              }`}
              onClick={handleNextFromCurrent}
              disabled={!currentPasswordInput}>
              Next
            </button>
          </div>
        </div>
      </Modal>

      <ChangeEmailPopup
        open={openEmailModal}
        onClose={setOpenEmailModal}
        initialEmail={email}
      />
      <ChangePasswordPopup
        open={openPasswordModal}
        onClose={setOpenPasswordModal}
      />
    </>
  );
};

export default ConfirmPasswordPopup;
