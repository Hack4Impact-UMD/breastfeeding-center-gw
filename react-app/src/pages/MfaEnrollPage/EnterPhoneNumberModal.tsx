import { useState } from "react";
import { User } from "firebase/auth";
import { isValidPhoneNumber } from "react-phone-number-input";
import Modal from "@/components/Modal";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosClose } from "react-icons/io";

interface EnterPhoneNumberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string, displayName: string) => void;
  authUser: User | null;
  isPending: boolean;
}

const EnterPhoneNumberModal = ({
  open,
  onClose,
  onSubmit,
  authUser,
  isPending,
}: EnterPhoneNumberModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState(authUser?.phoneNumber || "");
  const [displayName, setDisplayName] = useState("");

  const handlePhoneNumberSubmit = () => {
    if (isValidPhoneNumber(phoneNumber)) {
      onSubmit(phoneNumber, displayName);
    }
  };

  const ModalHeader = () => (
    <>
      <div className="flex justify-between items-center my-2 mx-4">
        <p className="text-base sm:text-lg">
          Enroll in SMS 2-Factor Authentication
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

  const isPhoneInputDisabled = !!authUser?.phoneNumber;
  const isPhoneValid = phoneNumber ? isValidPhoneNumber(phoneNumber) : false;

  return (
    <Modal open={open} onClose={onClose} width={600}>
      <div className="flex flex-col bg-white rounded-2xl w-full">
        <ModalHeader />

        <div className="flex flex-col m-4 sm:m-8 mb-2 text-left">
          <div className="flex flex-col sm:grid sm:grid-cols-[150px_1fr] sm:gap-x-4">
            <label className="text-sm font-medium mb-1 sm:mb-0 sm:content-center">
              Phone Number:
            </label>
            <PhoneInput
              value={phoneNumber}
              onChange={(value) => setPhoneNumber((value as string) || "")}
              defaultCountry="US"
              placeholder="Enter phone number"
              disabled={isPhoneInputDisabled}
            />
          </div>
          <div className="sm:grid sm:grid-cols-[150px_1fr] sm:gap-x-4 min-h-5">
            <div className="hidden sm:block"></div>
            {phoneNumber && !isPhoneValid && (
              <p className="text-red-600 text-xs sm:text-sm">
                Phone number is invalid
              </p>
            )}
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-[150px_1fr] sm:gap-x-4">
            <label className="text-sm font-medium mb-1 sm:mb-0 sm:content-center">
              Display Name:
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., My Personal Phone"
            />
          </div>
        </div>

        <div className="flex justify-center sm:justify-end mx-4 sm:mx-8 mb-4 sm:mb-8">
          <Button
            variant={"yellow"}
            className="w-full sm:w-auto py-4 px-6 text-sm sm:text-base"
            disabled={
              !phoneNumber || !displayName || !isPhoneValid || isPending
            }
            onClick={handlePhoneNumberSubmit}
          >
            {isPending ? "Sending..." : "Send Verification Code"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EnterPhoneNumberModal;
