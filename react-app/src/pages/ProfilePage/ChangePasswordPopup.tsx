import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Modal from "../../components/Modal";
import { PASSWORD_REQUIREMENTS, validatePassword } from "@/lib/passwordUtils";
import { Button } from "@/components/ui/button";

const ChangePasswordPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPasswordRequirementsError, setShowPasswordRequirementsError] =
    useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleOnClose = () => {
    onClose();
    setNewPassword("");
    setConfirmNewPassword("");
    setShowPasswordRequirementsError(false);
    setShowNewPwd(false);
    setShowConfirmPwd(false);
  };

  const handleNewPasswordSubmit = () => {
    const isValid = validatePassword(newPassword);
    const isMatch = newPassword === confirmNewPassword;
    setShowPasswordRequirementsError(!isValid);

    if (isValid && isMatch) {
      console.log("Valid password");
      handleOnClose();
    }
  };

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

  const saveDisabled =
    !newPassword ||
    !confirmNewPassword ||
    newPassword !== confirmNewPassword ||
    !validatePassword(newPassword);


  
  return (
    <Modal open={open} onClose={() => onClose()} height={290} width={600}>
      <div className="flex flex-col bg-white rounded-2xl w-full">
        <ModalHeader onClose={() => onClose()} />
          
          <div className="flex flex-col m-4 sm:m-8 mb-2 text-left">
  {/* New Password */}
  <div className="flex flex-col sm:grid sm:grid-cols-[190px_1fr] sm:gap-x-2">
    <label className="text-sm sm:text-base font-medium mb-1 sm:mb-0 text-nowrap sm:content-center flex items-center gap-1">
      <span>Enter New Password:</span>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-xl sm:text-2xl text-gray-500 hover:text-gray-700"
            aria-label="Password requirements"
          >
            <AiOutlineInfoCircle className="text-[#0F4374]" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="p-0 border-0 bg-transparent rounded text-xs sm:text-sm"
        >
          <div className="bg-[#0F4374] text-white p-2 rounded-lg">
            <ul className="text-xs sm:text-sm list-disc list-inside">
              {PASSWORD_REQUIREMENTS.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </label>

    <div className="relative">
      <input
        type={showNewPwd ? "text" : "password"}
        value={newPassword}
        onChange={(e) => {
          const val = e.target.value;
          setNewPassword(val);
          setShowPasswordRequirementsError(
            val !== "" && !validatePassword(val),
          );
        }}
        className={`w-full border rounded px-3 py-2 pr-10 text-sm sm:text-base ${
          showPasswordRequirementsError
            ? "border-red-500"
            : "border-black"
        }`}
        placeholder="New password"
        autoComplete="new-password"
      />
      <button
        type="button"
        className="absolute right-2 top-2 text-xl sm:text-2xl text-gray-500 hover:text-gray-700"
        onClick={() => setShowNewPwd((v) => !v)}
        aria-label={showNewPwd ? "Hide password" : "Show password"}
      >
        {showNewPwd ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
      </button>
    </div>
  </div>

  {/* Password requirements error */}
  {showPasswordRequirementsError && (
    <div className="sm:grid sm:grid-cols-[190px_1fr] sm:gap-x-2 mt-1">
      <div className="hidden sm:block"></div>
      <p className="text-red-600 text-xs sm:text-sm">
        Password does not meet requirements
      </p>
    </div>
  )}

  {/* Confirm Password */}
  <div className="flex flex-col sm:grid sm:grid-cols-[190px_1fr] sm:gap-x-2 mt-3 sm:mt-4">
    <label className="text-sm sm:text-base font-medium mb-1 sm:mb-0 sm:content-center text-nowrap">
      Confirm New Password:
    </label>

    <div className="relative">
      <input
        type={showConfirmPwd ? "text" : "password"}
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        onKeyDown={(event) => {
          if (
            newPassword &&
            confirmNewPassword &&
            event.key === "Enter"
          )
            handleNewPasswordSubmit();
        }}
        className="w-full border rounded px-3 py-2 pr-10 border-black text-sm sm:text-base"
        placeholder="Confirm password"
        autoComplete="new-password"
      />
      <button
        type="button"
        className="absolute right-2 top-2 text-xl sm:text-2xl text-gray-500 hover:text-gray-700"
        onClick={() => setShowConfirmPwd((v) => !v)}
        aria-label={showConfirmPwd ? "Hide password" : "Show password"}
      >
        {showConfirmPwd ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
      </button>
    </div>
  </div>

  {/* Password match status */}
  {confirmNewPassword && newPassword !== confirmNewPassword && (
    <div className="sm:grid sm:grid-cols-[190px_1fr] sm:gap-x-2 mt-1">
      <div className="hidden sm:block"></div>
      <p className="text-red-600 text-xs sm:text-sm">Password does not match</p>
    </div>
  )}
</div>

{/* Save Button */}
<div className="flex justify-center sm:justify-end mx-4 sm:mx-8 mb-4 sm:mb-8">
  <Button
    variant={"yellow"}
    className="w-full sm:w-auto py-4 px-6 text-sm sm:text-base"
    disabled={saveDisabled}
    onClick={handleNewPasswordSubmit}
  >
    Save
  </Button>
</div>
        </div>
      
    </Modal>
  );
};

export default ChangePasswordPopup;