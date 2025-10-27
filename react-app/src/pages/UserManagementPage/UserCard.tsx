import React from "react";
import ProfileIcon from "../../components/ProfileIcon";
import Modal from "../../components/Modal";
import { User } from "@/types/UserType";
import { Button } from "../../components/ui/button";
import { IoIosClose } from "react-icons/io";

const roleChipClass =
  "px-5 py-1 rounded-full text-base border border-black bg-background flex items-center";

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const [isChangeAccessOpen, setIsChangeAccessOpen] = React.useState(false);
  const defaultAccess: "Volunteer" | "Admin" =
    user.type === "VOLUNTEER" ? "Volunteer" : "Admin";
  const isDirector = user.type === "DIRECTOR";
  const [selectedAccess, setSelectedAccess] = React.useState<
    "Volunteer" | "Admin"
  >(defaultAccess);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
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
        <Button
          variant="outline"
          onClick={() => {
            setSelectedAccess(defaultAccess);
            setIsChangeAccessOpen(true);
          }}
        >
          Change Access
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            // Placeholder logic: show director block if this is a director
            if (isDirector) {
              setIsDirectorBlockOpen(true);
            } else {
              setIsRemoveConfirmOpen(true);
            }
          }}
        >
          Remove Access
        </Button>
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
              <div className="w-[140px]">
                {isDirector ? (
                  <div className="relative">
                    <div className="w-full border border-gray-300 rounded-full h-12 px-4 text-sm font-semibold tracking-wide shadow-sm bg-gray-50 text-gray-700 flex items-center justify-center">
                      DIRECTOR
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setIsDropdownOpen(false);
                    }}
                  >
                    <button
                      type="button"
                      className="w-full border border-gray-300 rounded-full h-12 pl-4 pr-12 text-sm font-semibold tracking-wide shadow-sm bg-white text-gray-900 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-400 relative cursor-pointer"
                      aria-haspopup="listbox"
                      aria-expanded={isDropdownOpen}
                      onClick={() => setIsDropdownOpen((v) => !v)}
                    >
                      <span>{selectedAccess.toUpperCase()}</span>
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-600 absolute right-3 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                        fill="currentColor"
                      >
                        <polygon points="12.5,18 3,7 22,7" />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <ul
                        role="listbox"
                        className="absolute left-0 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-full"
                      >
                        {(["Admin", "Volunteer"] as const).map((role) => (
                          <li
                            role="option"
                            aria-selected={selectedAccess === role}
                            key={role}
                            className={`px-4 py-2 text-sm font-semibold cursor-pointer select-none ${
                              selectedAccess === role
                                ? "bg-gray-100"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => {
                              setSelectedAccess(role);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {role.toUpperCase()}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
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
                  // TODO: no-op for now
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
                // TODO: no-op for now
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
