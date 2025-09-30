// src/pages/UserManagementPage/UserManagementPage.tsx
import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Header from "../../components/Header";
import UserFilters from "./UserFilters";
import UserCard, { User } from "./UserCard";

const UserManagementPage: React.FC = () => {
  const [navBarOpen, setNavBarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const users: User[] = [
    { firstName: "Isabella", lastName: "Clarke", email: "example@gmail.com", phone: "XXX-XXX-XXXX", role: "Director" },
    { firstName: "Mark", lastName: "Cooke", email: "example@gmail.com", phone: "XXX-XXX-XXXX", role: "Volunteer" },
    { firstName: "William", lastName: "Williams", email: "example@gmail.com", phone: "XXX-XXX-XXXX", role: "Admin" },
  ];

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.lastName}, ${u.firstName}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) &&
      (roleFilter === "All" || u.role === roleFilter)
    );
  });

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-100 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]"
        }`}
      >
        <Header />

        <div className="flex flex-col p-8 pr-20 pl-20">
          {/* Filters area */}
          <UserFilters
            search={search}
            setSearch={setSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            onAddUserClick={() => {
              /* no modal for now — placeholder for handler */
              console.log("Add user clicked");
            }}
          />

          {/* column headers (Name / Actions) */}
          <div className="flex justify-between items-center mt-4 pb-3 border-b border-gray-300">
            <div className="text-sm font-semibold">Name</div>
            <div className="text-sm font-semibold">Actions</div>
          </div>

          {/* user list */}
          <div className="mt-3">
            {filteredUsers.map((u, i) => (
              <UserCard key={i} user={u} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagementPage;
