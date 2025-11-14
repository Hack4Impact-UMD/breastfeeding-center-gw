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
  onClose: any;
  initialEmail: string;
}) => {
  //@ts-expect-error
  const [email, setEmail] = useState(initialEmail); // display value
  const [newEmail, setNewEmail] = useState(""); // value while changing email & used for checks
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  //@ts-expect-error
  const [showEmailMatchError, setShowEmailMatchError] = useState(false);
  const [showEmailInvalidError, setShowEmailInvalidError] = useState(false);

  const validateEmail = (email: any) => {
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
        <p className="text-lg">Change Email</p>
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
      <div className="flex flex-col h-full">
        <div>
          <ModalHeader onClose={() => onClose()} />
          <div className="grid grid-cols-[170px_1fr] m-8 mb-2 text-left">
            <label className="text-sm font-medium content-center">
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
              className="flex-1 border-[1.5px] border-black px-3 py-2"
              placeholder="New email"
            />
            <div className="h-[30px]"></div>
            {/* TODO: Implement email validation message */}
            <p className="text-red-600 text-sm">valid email check here</p>
            <label className="text-sm font-medium content-center">
              Confirm New Email:
            </label>
            <input
              type="email"
              value={confirmNewEmail}
              onChange={(e) => {
                setConfirmNewEmail(e.target.value);
                setShowEmailMatchError(newEmail !== e.target.value);
              }}
              className="flex-1 border-[1.5px] border-black px-3 py-2"
              placeholder="Confirm email"
            />
            <div className="h-[20px]"></div>
            {confirmNewEmail &&
              (newEmail === confirmNewEmail ? (
                <p className="text-green-600 text-sm">Email matches.</p>
              ) : (
                <p className="text-red-600 text-sm">Emails do not match.</p>
              ))}
          </div>
        </div>

        <div className="flex justify-end m-8 mt-0">
          <Button
            variant={"yellow"}
            className="py-4 px-6 text-md"
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
    </Modal>
  );
};

export default ChangeEmailPopup;
