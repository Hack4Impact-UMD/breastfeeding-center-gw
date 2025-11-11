import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { isValidPhoneNumber } from "react-phone-number-input";
import Modal from "../../components/Modal";
import PhoneInput from "@/components/ui/phone-input";

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
      <div className="flex justify-between items-center m-2">
        <p className="text-lg">Change Phone Number</p>
        <IoIosClose
          className="text-2xl cursor-pointer hover:text-gray-500"
          onClick={onClose}
        />
      </div>
      <div className="w-full h-[1.5px] bg-black my-2" />
    </>
  );

  const isPhoneValid = newPhone ? isValidPhoneNumber(newPhone) : true;
  const doPhoneNumbersMatch = confirmNewPhone ? newPhone === confirmNewPhone : true;

  return (
    <Modal open={open} onClose={() => onClose()} height={290} width={600}>
      <div className="flex flex-col h-full">
        <ModalHeader onClose={() => onClose()} />
        
        <div className="m-8 mb-2 space-y-4">
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
                <p className="text-red-600 text-sm">Phone number does not match.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end m-8 mt-auto">
          <button
            className={`px-4 py-2 border-black rounded ${
              !newPhone ||
              !confirmNewPhone ||
              !doPhoneNumbersMatch ||
              !isPhoneValid
                ? "bg-bcgw-gray-light text-black cursor-not-allowed"
                : "bg-bcgw-yellow-dark text-black hover:bg-bcgw-yellow-light"
            }`}
            onClick={handleNewPhoneSubmit}
            disabled={
              !newPhone ||
              !confirmNewPhone ||
              !doPhoneNumbersMatch ||
              !isPhoneValid
            }
          >
            SAVE
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePhoneNumberPopup;