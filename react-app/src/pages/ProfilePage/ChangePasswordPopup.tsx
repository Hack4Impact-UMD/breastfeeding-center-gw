import { useCallback } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "../../components/Modal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthProvider";
import { sendPasswordReset } from "@/services/authService";
import { showErrorToast } from "@/components/Toasts/ErrorToast";
import { showSuccessToast } from "@/components/Toasts/SuccessToast";

const ChangePasswordPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { profile } = useAuth();

  const handleSendPasswordReset = useCallback(async () => {
    try {
      if (!profile?.email) throw new Error("Email not found!");
      await sendPasswordReset(profile.email);
      showSuccessToast(
        `Password reset email sent to ${profile.email}! Check your inbox.`,
      );
      onClose();
    } catch (err) {
      console.error(err);
      showErrorToast("Failed to send password reset email.");
    }
  }, [onClose, profile?.email]);

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center my-2 mx-4">
        <p className="text-base sm:text-lg">Change Password</p>
        <button
          onClick={onClose}
          className="text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
          aria-label="Close"
        >
          <IoIosClose size={32} className="sm:text-[45px]" />
        </button>
      </div>
      <div className="w-full h-px bg-black" />
    </>
  );
  return (
    <Modal open={open} onClose={() => onClose()} height={200} width={500}>
      <div className="flex flex-col bg-white rounded-2xl w-full h-full">
        <ModalHeader onClose={() => onClose()} />

        <div className="flex flex-col gap-2 p-4 mb-2 text-left h-full">
          <p>
            Click the button below to send a password reset email to the email
            address associated with your account ({profile?.email}).
          </p>
          <Button
            variant={"yellow"}
            className="w-full sm:w-auto py-4 px-6 mt-3 text-sm sm:text-base"
            onClick={handleSendPasswordReset}
          >
            Send Password Reset Email
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordPopup;
