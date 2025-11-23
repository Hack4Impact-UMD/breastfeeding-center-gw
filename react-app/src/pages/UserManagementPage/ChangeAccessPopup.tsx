import { useState } from "react";
import Modal from "../../components/Modal";
import { IoIosClose } from "react-icons/io";
import { Role, RoleLevels, User } from "@/types/UserType";
import { Button } from "../../components/ui/button";
import { useUpdateUserRole } from "@/hooks/mutations/useUpdateUserRole";
import SelectDropdown from "@/components/SelectDropdown";

const ChangeAccessPopup = ({
  openModal,
  onClose,
  user,
  profile,
}: {
  openModal: boolean;
  onClose: () => void;
  user: User;
  profile: User | null;
}): React.JSX.Element => {
  const { mutate: updateUserRole } = useUpdateUserRole();
  const [selectedRole, setSelectedRole] = useState<Role>(user.type);
  const roleOptions: Role[] = getRoleOptions();

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
    <Modal open={openModal} onClose={() => onClose()} height={220} width={400}>
      <div className="h-full flex flex-col relative">
        {/* Close icon top-right */}
        <button
          onClick={() => onClose()}
          className="w-full flex justify-end p-2 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
        >
          <IoIosClose size={32} />
        </button>

        {/* Title */}
        <h2 className="px-8 pb-6 text-2xl font-semibold text-center">
          Change Access
        </h2>

        {/* Real dropdown, defaults to current card role */}
        <div className="px-8 pb-8 w-full flex justify-center items-center">
          <SelectDropdown
            options={roleOptions}
            selected={selectedRole}
            onChange={(role) => setSelectedRole(role as Role)}
            className="flex justify-center"
          />
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex justify-center gap-3">
          <Button variant="outline" onClick={() => onClose()}>
            CANCEL
          </Button>
          <Button
            variant="yellow"
            onClick={() => {
              updateUserRole({ id: user.auth_id, role: selectedRole });
              onClose();
            }}
          >
            CONFIRM
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeAccessPopup;
