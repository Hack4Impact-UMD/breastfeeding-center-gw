import React from "react";
import ProfileIcon from "../../components/ProfileIcon";
import Modal from "../../components/Modal";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "Director" | "Admin" | "Volunteer" | string;
};

const roleChipClass =
  "px-5 py-1 rounded-full text-base border border-black bg-white flex items-center";

const ActionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`text-base px-4 py-2 border border-black rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer ${
      className ?? ""
    }`}
  >
    {children}
  </button>
);


const UserCard: React.FC<{ user: User }> = ({ user }) => {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const [isChangeAccessOpen, setIsChangeAccessOpen] = React.useState(false);
  const defaultAccess: "Volunteer" | "Admin" =
    user.role === "Volunteer" ? "Volunteer" : "Admin";
  const isDirector = user.role === "Director";
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
          <a className="text-2xl text-blue w-65">
            {user.lastName}, {user.firstName}
          </a>
          <span className={roleChipClass}>{user.role}</span>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-lg text-black">Email: {user.email}</p>
          <p className="text-lg text-black">
            Phone: {user.phone ?? "XXX-XXX-XXXX"}
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <ActionButton
          onClick={() => {
            setSelectedAccess(defaultAccess);
            setIsChangeAccessOpen(true);
          }}
          className="hover:bg-[#F5BB47] cursor-pointer"
        >
          Change Access
        </ActionButton>
        <ActionButton
          className="hover:bg-[#F5BB47] cursor-pointer"
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
        </ActionButton>
      </div>

      {/* Change Access Modal (UI only, no functionality wired) */}
      <div>
        <Modal
          open={isChangeAccessOpen}
          onClose={() => setIsChangeAccessOpen(false)}
          height={260}
          width={520}
        >
          <div className="h-full flex flex-col relative">
            {/* Close icon top-right */}
            <button
              aria-label="Close"
              className="absolute right-4 top-4 p-1 rounded hover:bg-gray-100"
              onClick={() => setIsChangeAccessOpen(false)}
            >
              <svg
                width="13.5"
                height="13.5"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-700"
              >
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Title */}
            <div className="px-8 pt-10 pb-6">
              <h3 className="text-2xl font-semibold text-center">Change Access</h3>
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
                  <div className="relative" onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsDropdownOpen(false);
                  }}>
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
                              selectedAccess === role ? "bg-gray-100" : "hover:bg-gray-50"
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
              <button
                className="h-10 px-5 rounded border-2 border-black text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                onClick={() => setIsChangeAccessOpen(false)}
              >
                CANCEL
              </button>
              <button
                className="h-10 px-5 rounded border-2 border-black text-sm font-semibold text-black cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#F5BB47" }}
                onClick={() => {
                  // no-op for now
                }}
              >
                CONFIRM
              </button>
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
            className="absolute right-4 top-4 p-1 rounded hover:bg-gray-100"
            onClick={() => setIsRemoveConfirmOpen(false)}
          >
            <svg
              width="13.5"
              height="13.5"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-700"
            >
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="px-8 pt-8 pb-2">
            <h3 className="text-2xl font-semibold text-center">Remove Access?</h3>
          </div>
          <div className="px-8 text-center text-lg text-gray-700">
            Are you sure you would like to remove this user's account?
          </div>
          <div className="px-8 pb-6 pt-6 flex justify-center gap-3">
            <button
              className="h-10 px-5 rounded border-2 border-black text-sm font-semibold hover:bg-gray-50 cursor-pointer"
              onClick={() => setIsRemoveConfirmOpen(false)}
            >
              CANCEL
            </button>
            <button
              className="h-10 px-5 rounded border-2 border-black text-sm font-semibold text-black cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#F5BB47" }}
              onClick={() => {
                // no-op for now
              }}
            >
              CONFIRM
            </button>
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
            className="absolute right-4 top-4 p-1 rounded hover:bg-gray-100"
            onClick={() => setIsDirectorBlockOpen(false)}
          >
            <svg
              width="13.5"
              height="13.5"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-700"
            >
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="px-8 pt-8 pb-3">
            <h3 className="text-2xl font-semibold text-center">Account Cannot Be Modified</h3>
          </div>
          <div className="px-8 text-center text-lg text-gray-700 leading-relaxed">
            This director account cannot be removed or set to a lower permission. There must be one director.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserCard;
