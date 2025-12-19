import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { isValidPhoneNumber } from "react-phone-number-input";
import Modal from "../../components/Modal";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { useUpdateUserPhone } from "@/hooks/mutations/useUpdateUserPhone";

const ChangePhoneNumberPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  initialPhone: string;
}) => {
  const [newPhone, setNewPhone] = useState("");
  const [confirmNewPhone, setConfirmNewPhone] = useState("");

  const { mutate: updatePhone, isPending } = useUpdateUserPhone(() => handleClose())

  const handleClose = () => {
    setNewPhone("");
    setConfirmNewPhone("");
    onClose();
  }

  const handleNewPhoneSubmit = () => {
    const isMatch = newPhone === confirmNewPhone;
    const isPhoneValid = isValidPhoneNumber(newPhone);

    if (isMatch && isPhoneValid) {
      console.log("Updated phone to:", newPhone);
      updatePhone({ newPhone });
    }
  };

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center my-2 mx-4">
        <p className="text-base sm:text-lg">Change Phone Number</p>
        <IoIosClose
          className="text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
          onClick={onClose}
          size={32}
        />
      </div>
      <div className="w-full h-[1.5px] bg-black" />
    </>
  );

  const isPhoneValid = newPhone ? isValidPhoneNumber(newPhone) : true;
  const doPhoneNumbersMatch = confirmNewPhone
    ? newPhone === confirmNewPhone
    : true;

  return (
    <Modal open={open} onClose={() => onClose()} height={290} width={600}>
      <div className="flex flex-col bg-white rounded-2xl w-full">
        <ModalHeader onClose={() => onClose()} />

        <div className="flex flex-col m-4 sm:m-8 mb-2 text-left">
          {/* New Phone Number Input */}
          <div className="flex flex-col sm:grid sm:grid-cols-[210px_1fr] sm:gap-x-4">
            <label className="text-sm font-medium mb-1 sm:mb-0 sm:content-center">
              Enter New Phone Number:
            </label>
            <PhoneInput
              value={newPhone}
              onChange={(value) => setNewPhone(value || "")}
              defaultCountry="US"
              placeholder="Enter phone number"
            />
          </div>

          {/* Phone validation error */}
          <div className="sm:grid sm:grid-cols-[210px_1fr] sm:gap-x-4 min-h-5">
            <div className="hidden sm:block"></div>
            {newPhone && !isPhoneValid && (
              <p className="text-red-600 text-xs sm:text-sm">
                Phone number is invalid
              </p>
            )}
          </div>

          {/* Confirm Phone Number Input */}
          <div className="flex flex-col sm:grid sm:grid-cols-[210px_1fr] sm:gap-x-4">
            <label className="text-sm font-medium mb-1 sm:mb-0 sm:content-center">
              Confirm New Phone Number:
            </label>
            <PhoneInput
              value={confirmNewPhone}
              onChange={(value) => setConfirmNewPhone(value || "")}
              defaultCountry="US"
              placeholder="Confirm phone number"
            />
          </div>

          {/* Phone match status */}
          <div className="sm:grid sm:grid-cols-[210px_1fr] sm:gap-x-4 min-h-5">
            <div className="hidden sm:block"></div>
            {confirmNewPhone &&
              (newPhone === confirmNewPhone ? (
                <p className="text-green-600 text-xs sm:text-sm">
                  Phone number matches.
                </p>
              ) : (
                <p className="text-red-600 text-xs sm:text-sm">
                  Phone number does not match.
                </p>
              ))}
          </div>
        </div>

        <div className="flex justify-center sm:justify-end mx-4 sm:mx-8 mb-4 sm:mb-8">
          <Button
            variant={"yellow"}
            className="w-full sm:w-auto py-4 px-6 text-sm sm:text-base"
            disabled={
              !newPhone ||
              !confirmNewPhone ||
              !doPhoneNumbersMatch ||
              !isPhoneValid ||
              isPending
            }
            onClick={handleNewPhoneSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePhoneNumberPopup;
