import React, { useState } from "react";
import Modal from "../../components/Modal";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AddAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (user: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({
  open,
  onClose,
  onConfirm,
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
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 pt-6">
          Add Account
        </h2>
        <div className="flex gap-2 mb-3 px-8">
          <input
            className="border rounded px-2 py-1 flex-1"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          <input
            className="border rounded px-2 py-3 flex-1"
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
          <button
            className="border px-4 py-1 rounded text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            className={`px-4 py-1 rounded text-white ${canConfirm ? "bg-[#F6B21B] hover:bg-yellow-500 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
            disabled={!canConfirm}
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
          </button>
        </div>
        {error && (
          <div className="text-xs text-red-600 text-center">{error}</div>
        )}
      </div>
    </Modal>
  );
};

export default AddAccountModal;
