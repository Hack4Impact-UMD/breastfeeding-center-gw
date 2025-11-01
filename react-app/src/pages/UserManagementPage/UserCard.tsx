import React from "react";
import ProfileIcon from "../../components/ProfileIcon";
import Modal from "../../components/Modal";
import { Role, RoleLevels, User } from "@/types/UserType";
import { Button } from "../../components/ui/button";
import { IoIosClose } from "react-icons/io";
import { useAuth } from "@/auth/AuthProvider";
import { useUpdateUserRole } from "@/hooks/mutations/useUpdateUserRole";
import { useDeleteUser } from "@/hooks/mutations/useDeleteUser";

const roleChipClass =
  "px-5 py-1 rounded-full text-base border border-black bg-background flex items-center";

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  const { profile } = useAuth()
  const { mutate: updateUserRole } = useUpdateUserRole();
  const { mutate: deleteUser } = useDeleteUser();

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const [isChangeAccessOpen, setIsChangeAccessOpen] = React.useState(false);
  const [selectedAccess, setSelectedAccess] = React.useState<
    Role
  >(user.type);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = React.useState(false);
  const [isDirectorBlockOpen, setIsDirectorBlockOpen] = React.useState(false);

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center py-9 px-6 border-b border-black gap-8">
      <ProfileIcon initials={initials} size={112} />

      {/* name + contact info */}
      <div>
        <div className="flex items-center">
          <a className="text-2xl text-[#165896] w-65">
            {user.lastName}, {user.firstName}
          </a>
          <span className={roleChipClass}>
            {user.type.substring(0, 1) + user.type.substring(1).toLowerCase()}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-lg text-black">Email: {user.email}</p>
          <p className="text-lg text-black">
            Phone: {user.phone ?? "XXX-XXX-XXXX"}
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        {
          (profile?.auth_id === user.auth_id) ||
            (profile?.type === "DIRECTOR") ||
            (profile?.type === "ADMIN" && RoleLevels[profile.type] >= RoleLevels[user.type]) ? <>
            <Button
              variant="outline"
              onClick={() => {
                setIsChangeAccessOpen(true);
              }}
              disabled={profile.type === "VOLUNTEER"}
            >
              Change Access
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Placeholder logic: show director block if this is a director
                // if (isDirector) {
                // setIsDirectorBlockOpen(true);
                // } else {
                setIsRemoveConfirmOpen(true);
                // }
              }}
            >
              Remove Access
            </Button>
          </> : <></>
        }
      </div>

      {/* Change Access Modal (UI only, no functionality wired) */}
      <div>
        <Modal
          open={isChangeAccessOpen}
          onClose={() => setIsChangeAccessOpen(false)}
          height={260}
          width={475}
        >
          <div className="h-full flex flex-col relative">
            {/* Close icon top-right */}
            <button
              aria-label="Close"
              className="absolute top-2.25 right-2.25 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
              onClick={() => setIsChangeAccessOpen(false)}
            >
              <IoIosClose size={40} />
            </button>

            {/* Title */}
            <div className="px-8 pt-10 pb-6">
              <h3 className="text-2xl font-semibold text-center">
                Change Access
              </h3>
            </div>

            {/* Real dropdown, defaults to current card role */}
            <div className="px-8 flex flex-col items-center">
              <select
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value as Role)}
                className="h-9 px-4 w-32 border border-black rounded bg-white text-sm focus:outline-none"
              >
                {["DIRECTOR", "ADMIN", "VOLUNTEER"].map(role => (
                  profile?.type === "DIRECTOR" || (RoleLevels[role as Role] < RoleLevels[profile?.type ?? "VOLUNTEER"]) ?
                    (<option key={role} value={role}>{role.charAt(0) + role.substring(1).toLocaleLowerCase()}</option>) : <></>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="px-8 pb-8 pt-4 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsChangeAccessOpen(false)}
              >
                CANCEL
              </Button>
              <Button
                variant="yellow"
                onClick={() => {
                  updateUserRole({ id: user.auth_id, role: selectedAccess });
                  setIsChangeAccessOpen(false);
                }}
              >
                CONFIRM
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Remove Access - Confirm Modal (UI only) */}
      <Modal
        open={isRemoveConfirmOpen}
        onClose={() => setIsRemoveConfirmOpen(false)}
        height={220}
        width={520}
      >
        <div className="h-full flex flex-col relative">
          <button
            aria-label="Close"
            className="absolute top-2.25 right-2.25 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
            onClick={() => setIsRemoveConfirmOpen(false)}
          >
            <IoIosClose size={40} />
          </button>

          <div className="px-8 pt-8 pb-2">
            <h3 className="text-2xl font-semibold text-center">
              Remove Access?
            </h3>
          </div>
          <div className="px-8 text-center text-lg text-gray-700">
            Are you sure you would like to remove this user's account?
          </div>
          <div className="px-8 pb-6 pt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsRemoveConfirmOpen(false)}
            >
              CANCEL
            </Button>
            <Button
              variant="yellow"
              onClick={() => {
                deleteUser(user.auth_id);
                setIsRemoveConfirmOpen(false);
              }}
            >
              CONFIRM
            </Button>
          </div>
        </div>
      </Modal>

      {/* Director Block Modal (UI only) */}
      <Modal
        open={isDirectorBlockOpen}
        onClose={() => setIsDirectorBlockOpen(false)}
        height={200}
        width={520}
      >
        <div className="h-full flex flex-col relative">
          <button
            aria-label="Close"
            className="absolute top-2.25 right-2.25 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
            onClick={() => setIsDirectorBlockOpen(false)}
          >
            <IoIosClose size={40} />
          </button>

          <div className="px-8 pt-8 pb-3">
            <h3 className="text-2xl font-semibold text-center">
              Account Cannot Be Modified
            </h3>
          </div>
          <div className="px-8 text-center text-lg text-gray-700 leading-relaxed">
            This director account cannot be removed or set to a lower
            permission. There must be one director.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserCard;
