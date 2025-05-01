import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "../../components/Modal";

const ChangePasswordPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: any;
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPasswordRequirementsError, setShowPasswordRequirementsError] =
    useState(false);

  const handleOnClose = () => {
    onClose();
    setNewPassword("");
    setConfirmNewPassword("");
    setShowPasswordRequirementsError(false);
  };

  const validatePassword = (password: string) => {
    const lengthCheck = password.length >= 13;
    const lowercaseCheck = /[a-z]/.test(password);
    const uppercaseCheck = /[A-Z]/.test(password);
    const digitCheck = /\d/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      lengthCheck &&
      lowercaseCheck &&
      uppercaseCheck &&
      digitCheck &&
      specialCharCheck
    );
  };

  const handleNewPasswordSubmit = () => {
    const isValid = validatePassword(newPassword);
    const isMatch = newPassword === confirmNewPassword;

    setShowPasswordRequirementsError(!isValid);

    if (isValid && isMatch) {
      // TODO: Change password
      console.log("Valid password");
      handleOnClose();
    }
  };

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center m-2">
        <p className="text-lg">Change Password</p>
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-0.25 right-0.25 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer">
          <IoIosClose size={45} />
        </button>
      </div>
      <div className="w-full h-[1.5px] bg-black my-2" />
    </>
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        handleOnClose();
      }}
      height={450}
      width={600}>
      <div className="flex flex-col h-full">
        <div>
          <ModalHeader
            onClose={() => {
              handleOnClose();
            }}
          />
          {/* New Password */}
          <div className="grid grid-cols-[190px_1fr] m-8 mb-2 gap-x-2">
            <label className="text-md font-medium text-nowrap content-center">
              Enter New Password:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setShowPasswordRequirementsError(
                  e.target.value !== "" && !validatePassword(e.target.value)
                );
              }}
              className="w-full border-[1.5px] border-black px-2 py-2"
              placeholder="New password"
            />
            <div></div>
            {/* Requirements Box */}
            <div className="border border-black p-3 text-sm">
              <ul className="list-disc ml-4 space-y-1">
                <li>Must include at least 13 characters</li>
                <li>Must include at least 1 lowercase letter</li>
                <li>Must include at least 1 uppercase letter</li>
                <li>Must include at least 1 digit</li>
                <li>Must include at least 1 special character</li>
              </ul>
            </div>
            <div className="h-[20px]"></div>
            {showPasswordRequirementsError && (
              <p className="text-red-600 text-sm">
                Password does not meet requirements
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="grid grid-cols-[190px_1fr] mx-8  mb-2 gap-x-2">
            <label className="text-md font-medium content-center text-nowrap">
              Confirm New Password:
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
              }}
              onKeyDown={(event) => {
                if (
                  newPassword &&
                  confirmNewPassword &&
                  event.key === "Enter"
                ) {
                  event.preventDefault();
                  handleNewPasswordSubmit();
                }
              }}
              className="w-full border-[1.5px] border-black px-2 py-2"
              placeholder="Confirm password"
            />
            <div className="h-[20px]"></div>
            {confirmNewPassword &&
              (newPassword === confirmNewPassword ? (
                <p className="text-green-600 text-sm">Password matches</p>
              ) : (
                <p className="text-red-600 text-sm">Password does not match</p>
              ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end m-8 mt-4">
          <button
            className={`px-6 py-2 rounded-lg border border-black text-black ${
              !newPassword ||
              !confirmNewPassword ||
              newPassword !== confirmNewPassword ||
              !validatePassword(newPassword)
                ? "bg-bcgw-gray-light cursor-not-allowed"
                : "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light cursor-pointer"
            }`}
            onClick={handleNewPasswordSubmit}
            disabled={
              !newPassword ||
              !confirmNewPassword ||
              newPassword !== confirmNewPassword ||
              !validatePassword(newPassword)
            }>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordPopup;
