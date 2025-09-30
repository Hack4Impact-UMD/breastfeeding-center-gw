// src/pages/UserManagementPage/UserFilters.tsx
import React from "react";
import addUserIcon from "../../assets/addUser.png"; // adjust path if needed

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
        {/* Left: filters */}
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
              className="h-9 px-10 border border-black rounded bg-white text-sm focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Director">Director</option>
              <option value="Admin">Admin</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          </div>
        </div>

        {/* Right: Add User button */}
        <div>
          <button
            type="button"
            onClick={onAddUserClick}
            className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-sm font-medium bg-white hover:bg-bcgw-yellow-dark transition-colors"
          >
            <img src={addUserIcon} alt="Add user" className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
