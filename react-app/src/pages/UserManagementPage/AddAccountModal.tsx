import React, { useState } from "react";
import Modal from "../../components/Modal";
import { Button } from "@/components/ui/original-button";
import { IoIosClose } from "react-icons/io";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AddAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (user: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
  disabled?: boolean;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({
  open,
  onClose,
  onConfirm,
  disabled = false,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const emailValid = emailRegex.test(email);
  const emailsMatch = email === confirmEmail;
  const allFilled = firstName && lastName && email && confirmEmail;
  const canConfirm = allFilled && emailValid && emailsMatch;

  let error = "";
  if (touched && !allFilled)
    error = "One of the fields is empty or contains invalid data.";
  else if (touched && !emailValid) error = "Email invalid";
  else if (touched && !emailsMatch) error = "Email addresses don’t match";

  return (
    <Modal open={open} onClose={onClose} width={500} height={370}>
      <div className="relative flex flex-col h-full">
        <button
          className="absolute top-2.25 right-2.25 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          <IoIosClose size={40} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 pt-6">
          Add Account
        </h2>
        <div className="flex gap-2 mb-3 px-8">
          <input
            className="border rounded px-2 py-1 w-1/2"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          <input
            className="border rounded px-2 py-3 w-1/2"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => setTouched(true)}
          />
        </div>
        <div className="mb-2 px-8">
          <input
            className="border rounded px-2 py-3 mb-2 w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          <input
            className="border rounded px-2 py-3 w-full"
            placeholder="Confirm Email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            onBlur={() => setTouched(true)}
          />
        </div>
        <div className="text-sm text-gray-700 mb-2 text-center">
          Are you sure you would like to create a new account?
        </div>
        <div className="flex gap-4 justify-center mb-2">
          <Button variant="outline" onClick={onClose} disabled={disabled}>
            CANCEL
          </Button>
          <Button
            variant="yellow"
            disabled={!canConfirm || disabled}
            onClick={() => {
              setTouched(true);
              if (canConfirm) {
                onConfirm({ firstName, lastName, email });
                setFirstName("");
                setLastName("");
                setEmail("");
                setConfirmEmail("");
                setTouched(false);
              }
            }}
          >
            CONFIRM
          </Button>
        </div>
        {error && (
          <div className="text-xs text-red-600 text-center">{error}</div>
        )}
      </div>
    </Modal>
  );
};

export default AddAccountModal;
