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
      <div className="flex justify-between items-center m-2">
        <p className="text-lg">Change Password</p>
        <button
          onClick={onClose}
          className="absolute top-0.25 right-0.25 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
          aria-label="Close"
        >
          <IoIosClose size={45} />
        </button>
      </div>
      {/* thinner divider */}
      <div className="w-full h-px bg-black my-2" />
    </>
  );

  const saveDisabled =
    !newPassword ||
    !confirmNewPassword ||
    newPassword !== confirmNewPassword ||
    !validatePassword(newPassword);

  return (
    <Modal open={open} onClose={handleOnClose} height={300} width={600}>
      <div className="flex flex-col h-full">
        <div>
          <ModalHeader onClose={handleOnClose} />

          {/* New Password */}
          <div className="grid grid-cols-[190px_1fr] m-8 mb-2 gap-x-2">
            <label className="text-md font-medium text-nowrap content-center flex items-center gap-1">
              <span>Enter New Password:</span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-2xl text-gray-500 hover:text-gray-700"
                    aria-label="Password requirements"
                  >
                    <AiOutlineInfoCircle className="text-[#0F4374]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="p-0 border-0 bg-transparent rounded text-sm"
                >
                  <div className="bg-[#0F4374] text-white p-2 rounded-lg">
                    <ul className="text-sm list-disc list-inside">
                      {PASSWORD_REQUIREMENTS.map((req) => (
                        <li key={req}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </label>

            {/* New Password Input */}
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
                className={`w-full border rounded px-3 py-2 pr-10 ${
                  showPasswordRequirementsError
                    ? "border-red-500"
                    : "border-black"
                }`}
                placeholder="New password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-2xl text-gray-500 hover:text-gray-700"
                onClick={() => setShowNewPwd((v) => !v)}
                aria-label={showNewPwd ? "Hide password" : "Show password"}
              >
                {showNewPwd ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>

            <div className="h-[20px]" />
            {showPasswordRequirementsError && (
              <p className="text-red-600 text-sm">
                Password does not meet requirements
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="grid grid-cols-[190px_1fr] mx-8 mb-2 gap-x-2">
            <label className="text-md font-medium content-center text-nowrap">
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
                className="w-full border rounded px-3 py-2 pr-10 border-black"
                placeholder="Confirm password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-2xl text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPwd((v) => !v)}
                aria-label={showConfirmPwd ? "Hide password" : "Show password"}
              >
                {showConfirmPwd ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>

            <div className="h-[20px]" />
            {/* show only red warning, no green message */}
            {confirmNewPassword && newPassword !== confirmNewPassword && (
              <p className="text-red-600 text-sm">Password does not match</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end m-8 mt-4">
          <button
            className={`px-6 py-2 rounded-lg border border-black text-black ${
              saveDisabled
                ? "bg-bcgw-gray-light cursor-not-allowed"
                : "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light cursor-pointer"
            }`}
            onClick={handleNewPasswordSubmit}
            disabled={saveDisabled}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordPopup;
