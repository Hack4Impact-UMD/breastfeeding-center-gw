import React from "react";
import ProfileIcon from "../../components/ProfileIcon";
import { RoleLevels, User } from "@/types/UserType";
import { Button } from "../../components/ui/button";
import { useAuth } from "@/auth/AuthProvider";
import ChangeAccessPopup from "./ChangeAccessPopup";
import DirectorBlockPopup from "./DirectorBlockPopup";
import RemoveAccessPopup from "./RemoveAccessPopup";

const roleChipClass =
  "px-4 max-[375px]:px-3 py-0.5 max-[375px]:py-0 rounded-full text-sm max-[375px]:text-xs border border-black bg-background flex items-center";

const UserCard: React.FC<{ user: User; singleDirector: boolean }> = ({
  user,
  singleDirector,
}) => {
  const { profile } = useAuth();

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const [isChangeAccessOpen, setIsChangeAccessOpen] = React.useState(false);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = React.useState(false);
  const [isDirectorBlockOpen, setIsDirectorBlockOpen] = React.useState(false);

  return (
    <div className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] items-center py-3 max-[375px]:pb-1 md:py-7 px-2 md:px-5 border-b border-black gap-2 max-[375px]:gap-1.5 md:gap-6">
      <div className="hidden md:block">
        <ProfileIcon initials={initials} size={102} />
      </div>

      {/* name + contact info */}
      <div className="min-w-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 max-[375px]:gap-1.5">
          <a className="text-xl max-[375px]:text-lg text-[#165896] truncate">
            {user.lastName}, {user.firstName}
          </a>
          <span className={roleChipClass}>
            {user.type.substring(0, 1) + user.type.substring(1).toLowerCase()}
          </span>
        </div>

        <div className="mt-3 max-[375px]:mt-2 space-y-1 max-[375px]:space-y-0.5">
          <p className="text-base max-[375px]:text-sm text-black">
            Email: {user.email}
          </p>
          <p className="text-base max-[375px]:text-sm text-black">
            Phone: {user.phone ?? "XXX-XXX-XXXX"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-[375px]:gap-2 lg:flex-row lg:gap-4 lg:justify-end flex-shrink-0">
        {profile?.type === "DIRECTOR" ||
        (profile?.type === "ADMIN" &&
          RoleLevels[profile.type] >= RoleLevels[user.type]) ? (
          <>
            <Button
              className="max-[375px]:py-1 max-[375px]:px-2 max-[375px]:text-xs hover:bg-bcgw-yellow-dark"
              variant="outline"
              onClick={() => {
                if (user.type === "DIRECTOR" && singleDirector) {
                  setIsDirectorBlockOpen(true);
                } else {
                  setIsChangeAccessOpen(true);
                }
              }}
            >
              Change Access
            </Button>
            <Button
              className="max-[375px]:py-1 max-[375px]:px-2 max-[375px]:text-xs hover:bg-bcgw-yellow-dark"
              variant="outline"
              onClick={() => {
                if (user.type === "DIRECTOR" && singleDirector) {
                  setIsDirectorBlockOpen(true);
                } else {
                  setIsRemoveConfirmOpen(true);
                }
              }}
            >
              Remove Access
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>

      {/* Change Access Modal */}
      <ChangeAccessPopup
        openModal={isChangeAccessOpen}
        onClose={() => setIsChangeAccessOpen(false)}
        user={user}
        profile={profile}
      />

      {/* Remove Access - Confirm Modal (UI only) */}
      <RemoveAccessPopup
        openModal={isRemoveConfirmOpen}
        onClose={() => setIsRemoveConfirmOpen(false)}
        user={user}
      />

      {/* Director Block Modal */}
      <DirectorBlockPopup
        openModal={isDirectorBlockOpen}
        onClose={() => setIsDirectorBlockOpen(false)}
      />
    </div>
  );
};

export default UserCard;
