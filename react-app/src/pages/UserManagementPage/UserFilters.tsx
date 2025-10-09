// src/pages/UserManagementPage/UserFilters.tsx
import React from "react";
import addUserIcon from "../../assets/addUser.png";
import { Button } from "@/components/ui/button";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  onAddUserClick?: () => void;
}

const UserFilters: React.FC<Props> = ({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  onAddUserClick,
}) => {
  return (
    <div className="py-6 border-b border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex gap-10 items-start">
          <div className="flex flex-col">
            <label className="text font-semibold text-black mb-2 uppercase">
              Name
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-56 h-9 px-3 border border-black rounded bg-white text-sm focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text font-semibold text-black mb-2 uppercase">
              Role Type
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 px-4 w-32 border border-black rounded bg-white text-sm focus:outline-none"
            >
              <option value="All">All</option>
              <option value="DIRECTOR">Director</option>
              <option value="ADMIN">Admin</option>
              <option value="VOLUNTEER">Volunteer</option>
            </select>
          </div>
        </div>

        <div>
          <Button
            type="button"
            onClick={onAddUserClick}
            className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-sm font-medium bg-white hover:bg-bcgw-yellow-dark transition-colors cursor-pointer"
          >
            <img src={addUserIcon} alt="Add user" className="w-4 h-4" />
            <span>Add User</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
