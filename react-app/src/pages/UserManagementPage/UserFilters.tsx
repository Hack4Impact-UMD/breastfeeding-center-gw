// src/pages/UserManagementPage/UserFilters.tsx
import React from "react";
import addUserIcon from "../../assets/addUser.png";
import { Button } from "@/components/ui/button";
import SelectDropdown from "@/components/SelectDropdown";

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
    <div className="pb-6 px-2.5 border-b border-gray-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        {/* Name and Role Type - side by side on mobile, gap on desktop */}
        <div className="flex justify-between md:justify-start md:gap-10 items-start w-full">
          {/* Name on the left */}
          <div className="flex flex-col">
            <label className="text font-normal text-black mb-2 uppercase">
              Name
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-36 sm:w-48 text-sm border rounded-md px-3 py-2 h-9 bg-white focus:outline-none"
            />
          </div>

          {/* Role Type on the right with button below on mobile */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-2 items-end w-full">
            <div className="flex flex-col">
              <label className="text font-normal text-black mb-2 uppercase">
                Role Type
              </label>
              <SelectDropdown
                options={["All", "DIRECTOR", "ADMIN", "VOLUNTEER"]}
                selected={roleFilter}
                onChange={setRoleFilter}
                className="w-36 sm:w-36"
              />
            </div>

            {/* Add User button */}
            <Button
              variant="yellow"
              onClick={onAddUserClick}
              className="flex items-center gap-2"
            >
              <img
                src={addUserIcon}
                alt="Add user"
                className="w-[21px] h-[21px]"
              />
              <span>Add User</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
