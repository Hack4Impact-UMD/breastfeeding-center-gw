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
    <div className="py-6 px-2.5 border-b border-gray-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        {/* Name and Role Type - side by side on mobile, gap on desktop */}
        <div className="flex justify-between md:justify-start md:gap-10 items-start w-full md:w-auto">
          {/* Name on the left */}
          <div className="flex flex-col">
            <label className="text font-normal text-black mb-2 uppercase">
              Name
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-36 md:w-48 h-8 px-3 border border-black rounded bg-white text-sm focus:outline-none"
            />
          </div>

          {/* Role Type on the right with button below on mobile */}
          <div className="flex flex-col gap-2 items-end md:items-start">
            <div className="flex flex-col">
              <label className="text font-normal text-black mb-2 uppercase">
                Role Type
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-8 px-3 w-28 border border-black rounded bg-white text-sm focus:outline-none"
              >
                <option value="All">All</option>
                <option value="DIRECTOR">Director</option>
                <option value="ADMIN">Admin</option>
                <option value="VOLUNTEER">Volunteer</option>
              </select>
            </div>

            {/* Add User button - under Role Type on mobile only */}
            <Button
              variant="outline"
              onClick={onAddUserClick}
              className="flex md:hidden items-center gap-2 bg-[#F5BB47] hover:bg-[#F5BB47]/90 border-1"
            >
              <img src={addUserIcon} alt="Add user" className="w-[21px] h-[21px]" />
              <span>Add User</span>
            </Button>
          </div>
        </div>

        {/* Add User button - on the right on desktop only */}
        <Button
          variant="outline"
          onClick={onAddUserClick}
          className="hidden md:flex items-center gap-2 bg-[#F5BB47] hover:bg-[#F5BB47]/90 border-1"
        >
          <img src={addUserIcon} alt="Add user" className="w-[21px] h-[21px]" />
          <span>Add User</span>
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;
