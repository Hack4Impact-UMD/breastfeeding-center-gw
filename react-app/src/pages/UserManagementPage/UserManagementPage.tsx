// src/pages/UserManagementPage/UserManagementPage.tsx
import React, { useMemo, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Header from "../../components/Header";
import UserFilters from "./UserFilters";
import UserCard from "./UserCard";
import AddAccountModal from "./AddAccountModal";
import { User } from "@/types/UserType";

const UserManagementPage: React.FC = () => {
  const [navBarOpen, setNavBarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const [users] = useState<User[]>([
    {
      firstName: "Isabella",
      lastName: "Clarke",
      email: "example@gmail.com",
      phone: "XXX-XXX-XXXX",
      type: "DIRECTOR",
      auth_id: "123",
    },
    {
      firstName: "Mark",
      lastName: "Cooke",
      email: "example@gmail.com",
      phone: "XXX-XXX-XXXX",
      type: "VOLUNTEER",
      auth_id: "def",
    },
    {
      firstName: "William",
      lastName: "Williams",
      email: "example@gmail.com",
      phone: "XXX-XXX-XXXX",
      type: "ADMIN",
      auth_id: "abc",
    },
  ]);

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        const fullName = `${u.lastName}, ${u.firstName}`.toLowerCase();
        return (
          fullName.includes(search.toLowerCase()) &&
          (roleFilter === "All" || u.type === roleFilter)
        );
      }),
    [users, roleFilter, search],
  );

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-100 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]"
        }`}
      >
        <Header />

        <div className="flex flex-col px-16 py-10">
          <UserFilters
            search={search}
            setSearch={setSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            onAddUserClick={() => setShowAddModal(true)}
          />

          <div className="flex justify-between items-center mt-4 pb-3 border-b border-gray-300">
            <div className="text-sm font-semibold">Name</div>
            <div className="text-sm font-semibold">Actions</div>
          </div>

          {/* user list */}
          <div className="mt-3">
            {filteredUsers.map((u) => (
              <UserCard key={u.auth_id} user={u} />
            ))}
          </div>
          <AddAccountModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            onConfirm={() => {
              //TODO: implement
            }}
          />
        </div>
      </div>
    </>
  );
};

export default UserManagementPage;
