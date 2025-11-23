import React, { useState } from "react";
import Modal from "../../components/Modal";
import { Button } from "@/components/ui/button";
import { IoIosClose } from "react-icons/io";
import { Role, RoleLevels, User } from "@/types/UserType";
import SelectDropdown from "@/components/SelectDropdown";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AddAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (user: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
  }) => void;
  disabled?: boolean;
  profile: User | null;
}

const AddAccountPopup: React.FC<AddAccountModalProps> = ({
  open,
  onClose,
  onConfirm,
  disabled = false,
  profile,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [role, setRole] = useState<Role>("VOLUNTEER");
  const [touched, setTouched] = useState(false);
  const roleOptions: Role[] = getRoleOptions();

  const emailValid = emailRegex.test(email);
  const emailsMatch = email === confirmEmail;
  const allFilled = firstName && lastName && email && confirmEmail;
  const canConfirm = allFilled && emailValid && emailsMatch;

  const handleClose = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setConfirmEmail("");
    setRole("VOLUNTEER");
    setTouched(false);
    onClose();
  };

  let error = "";
  if (touched && !allFilled)
    error = "One of the fields is empty or contains invalid data.";
  else if (touched && !emailValid) error = "Email invalid";
  else if (touched && !emailsMatch) error = "Email addresses don’t match";

  function getRoleOptions(): Role[] {
    // If the profile is a director, they can select any role
    // Otherwise, they can select any role equal to or below their own
    return ["DIRECTOR", "ADMIN", "VOLUNTEER"].filter(
      (role) =>
        profile?.type === "DIRECTOR" ||
        RoleLevels[role as Role] <= RoleLevels[profile?.type ?? "VOLUNTEER"],
    ) as Role[];
  }

  return (
    <Modal open={open} onClose={handleClose} width={500} height={450}>
      <div className="relative flex flex-col h-full">
        <div className="w-full flex justify-end p-2">
          <IoIosClose
            className="text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
            onClick={() => handleClose()}
            aria-label="Close"
            size={32}
          />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">Add Account</h2>
        <div className="flex gap-2 mb-3 px-8">
          <input
            className="border rounded px-3 py-2 w-1/2"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          <input
            className="border rounded px-3 py-2 w-1/2"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => setTouched(true)}
          />
        </div>
        <div className="mb-3 px-8">
          <input
            className="border rounded px-3 py-2 mb-3 w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Confirm Email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            onBlur={() => setTouched(true)}
          />
        </div>
        <div className="mb-8 flex items-center justify-center">
          <SelectDropdown
            options={roleOptions}
            selected={role}
            onChange={(value) => setRole(value as Role)}
            className={"w-36 sm:w-36 flex justify-center"}
          />
        </div>
        <div className="text-sm text-gray-700 mb-3 text-center">
          Are you sure you would like to create a new account?
        </div>
        <div className="flex gap-4 justify-center mb-3">
          <Button variant="outline" onClick={handleClose} disabled={disabled}>
            CANCEL
          </Button>
          <Button
            variant="yellow"
            disabled={!canConfirm || disabled}
            onClick={() => {
              setTouched(true);
              if (canConfirm) {
                onConfirm({ firstName, lastName, email, role });
                setFirstName("");
                setLastName("");
                setEmail("");
                setConfirmEmail("");
                setRole("VOLUNTEER");
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

export default AddAccountPopup;
