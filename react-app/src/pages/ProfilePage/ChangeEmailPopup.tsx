import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "../../components/Modal";
import { Button } from "@/components/ui/button";

const ChangeEmailPopup = ({
  open,
  onClose,
  initialEmail,
}: {
  open: boolean;
  onClose: () => void;
  initialEmail: string;
}) => {
  const [, setEmail] = useState(initialEmail); // display value
  const [newEmail, setNewEmail] = useState(""); // value while changing email & used for checks
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [, setShowEmailMatchError] = useState(false);
  const [showEmailInvalidError, setShowEmailInvalidError] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleNewEmailSubmit = () => {
    const isMatch = newEmail === confirmNewEmail;
    const isEmailValid = validateEmail(newEmail);

    setShowEmailMatchError(!isMatch);
    setShowEmailInvalidError(!isEmailValid);

    if (isMatch && isEmailValid) {
      console.log("Updated email to:", newEmail);
      setEmail(newEmail);
      setConfirmNewEmail("");
      onClose();
    }
  };

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center my-2 mx-4">
        <p className="text-base sm:text-lg">Change Email</p>
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
    <Modal open={open} onClose={() => onClose()} height={290} width={600}>
      <div className="flex justify-center items-center sm:block">
        <div className="flex flex-col bg-white rounded-2xl w-full h-auto overflow-y-auto sm:overflow-visible">
          <ModalHeader onClose={() => onClose()} />

          <div className="flex flex-col m-4 sm:m-8 mb-2 text-left">
            {/* New Email Input */}
            <div className="flex flex-col sm:grid sm:grid-cols-[170px_1fr] sm:gap-x-2">
              <label className="text-sm font-medium mb-1 sm:mb-0 sm:content-center">
                Enter New Email:
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setShowEmailMatchError(e.target.value !== confirmNewEmail);
                  setShowEmailInvalidError(
                    e.target.value ? !validateEmail(e.target.value) : false,
                  );
                }}
                className="flex-1 border-[1.5px] border-black px-3 py-2 text-sm sm:text-base"
                placeholder="New email"
              />
            </div>

            {/* Email validation error */}
            <div className="sm:grid sm:grid-cols-[170px_1fr] sm:gap-x-2 sm:min-h-[30px]">
              <div className="hidden sm:block"></div>
              {showEmailInvalidError && newEmail && (
                <p className="text-red-600 text-xs sm:text-sm">
                  Please enter a valid email
                </p>
              )}
            </div>

            {/* Confirm Email Input */}
            <div className="flex flex-col sm:grid sm:grid-cols-[170px_1fr] sm:gap-x-2 mt-3 sm:mt-4">
              <label className="text-sm font-medium mb-1 sm:mb-0 sm:content-center">
                Confirm New Email:
              </label>
              <input
                type="email"
                value={confirmNewEmail}
                onChange={(e) => {
                  setConfirmNewEmail(e.target.value);
                  setShowEmailMatchError(newEmail !== e.target.value);
                }}
                className="flex-1 border-[1.5px] border-black px-3 py-2 text-sm sm:text-base"
                placeholder="Confirm email"
              />
            </div>

            {/* Email match status */}
            <div className="sm:grid sm:grid-cols-[170px_1fr] sm:gap-x-2">
              <div className="hidden sm:block"></div>
              {confirmNewEmail &&
                (newEmail === confirmNewEmail ? (
                  <p className="text-green-600 text-xs sm:text-sm">
                    Email matches.
                  </p>
                ) : (
                  <p className="text-red-600 text-xs sm:text-sm">
                    Emails do not match.
                  </p>
                ))}
            </div>
          </div>

          <div className="flex justify-center sm:justify-end mx-4 sm:mx-8 mb-4 sm:mb-8">
            <Button
              variant={"yellow"}
              className="w-full sm:w-auto py-4 px-6 text-sm sm:text-base"
              disabled={
                !newEmail ||
                !confirmNewEmail ||
                newEmail !== confirmNewEmail ||
                showEmailInvalidError
              }
              onClick={handleNewEmailSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeEmailPopup;
