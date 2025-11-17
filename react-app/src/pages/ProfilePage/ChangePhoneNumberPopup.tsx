import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { isValidPhoneNumber } from "react-phone-number-input";
import Modal from "../../components/Modal";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";

const ChangePhoneNumberPopup = ({
  open,
  onClose,
  initialPhone,
}: {
  open: boolean;
  onClose: any;
  initialPhone: string;
}) => {
  //@ts-expect-error
  const [phone, setPhone] = useState(initialPhone);
  const [newPhone, setNewPhone] = useState("");
  const [confirmNewPhone, setConfirmNewPhone] = useState("");

  const handleNewPhoneSubmit = () => {
    const isMatch = newPhone === confirmNewPhone;
    const isPhoneValid = isValidPhoneNumber(newPhone);

    if (isMatch && isPhoneValid) {
      console.log("Updated phone to:", newPhone);
      setPhone(newPhone);
      setNewPhone("");
      setConfirmNewPhone("");
      onClose();
    }
  };

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center my-2 mx-4">
        <p className="text-lg">Change Phone Number</p>
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
      <div className="flex flex-col h-full">
        <ModalHeader onClose={() => onClose()} />

        <div className="m-8 mb-2 space-y-4 text-left">
          <div className="grid grid-cols-[210px_1fr] items-center gap-x-4">
            <label className="text-sm font-medium">
              Enter New Phone Number:
            </label>
            <PhoneInput
              value={newPhone}
              onChange={(value) => setNewPhone(value || "")}
              defaultCountry="US"
              placeholder="Enter phone number"
              className="border-[1.5px] border-black"
            />
          </div>

          {newPhone && !isPhoneValid && (
            <div className="grid grid-cols-[210px_1fr] gap-x-4">
              <div></div>
              <p className="text-red-600 text-sm">Phone number is invalid</p>
            </div>
          )}

          <div className="grid grid-cols-[210px_1fr] items-center gap-x-4">
            <label className="text-sm font-medium">
              Confirm New Phone Number:
            </label>
            <PhoneInput
              value={confirmNewPhone}
              onChange={(value) => setConfirmNewPhone(value || "")}
              defaultCountry="US"
              placeholder="Confirm phone number"
              className="border-[1.5px] border-black"
            />
          </div>

          {confirmNewPhone && (
            <div className="grid grid-cols-[210px_1fr] gap-x-4">
              <div></div>
              {newPhone === confirmNewPhone ? (
                <p className="text-green-600 text-sm">Phone number matches.</p>
              ) : (
                <p className="text-red-600 text-sm">
                  Phone number does not match.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end m-8 mt-0">
          <Button
            variant={"yellow"}
            className="py-4 px-6 text-md"
            disabled={
              !newPhone ||
              !confirmNewPhone ||
              !doPhoneNumbersMatch ||
              !isPhoneValid
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
