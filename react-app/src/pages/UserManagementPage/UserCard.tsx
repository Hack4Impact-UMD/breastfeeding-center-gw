import React from "react";
import ProfileIcon from "../../components/ProfileIcon";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "Director" | "Admin" | "Volunteer" | string;
};

const roleChipClass =
  "px-5 py-1 rounded-full text-base border border-black bg-white flex items-center";

const ActionButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <button className="text-base px-4 py-2 border border-black rounded hover:bg-gray-50 transition">
    {children}
  </button>
);


const UserCard: React.FC<{ user: User }> = ({ user }) => {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center py-9 px-6 border-b border-black gap-8">
      {/* avatar */}
      <ProfileIcon initials={initials} size={112} />

      {/* name + contact info */}
      <div>
        <div className="flex items-center">
          {/* fixed width forces alignment across all cards */}
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

      {/* aligned actions */}
      <div className="flex gap-4 justify-end">
        <ActionButton>Change Access</ActionButton>
        <ActionButton>Remove Access</ActionButton>
      </div>
    </div>
  );
};

export default UserCard;
