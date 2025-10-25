// src/pages/UserManagementPage/UserManagementPage.tsx
import React, { useMemo, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Header from "../../components/Header";
import UserFilters from "./UserFilters";
import UserCard from "./UserCard";
import AddAccountModal from "./AddAccountModal";
import { useAllUsers } from "@/hooks/queries/useUsers";
import Loading from "@/components/Loading";
import { useMutation } from "@tanstack/react-query";
import { sendUserInvite } from "@/backend/InviteFunctions";

const UserManagementPage: React.FC = () => {
  const [navBarOpen, setNavBarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: users, isPending, error } = useAllUsers()

  const filteredUsers = useMemo(
    () =>
      users?.filter((u) => {
        const fullName = `${u.lastName}, ${u.firstName}`.toLowerCase();
        return (
          fullName.includes(search.toLowerCase()) &&
          (roleFilter === "All" || u.type === roleFilter)
        );
      }),
    [users, roleFilter, search],
  );

  const inviteUserMutation = useMutation({
    mutationFn: async ({ firstName, lastName, email }: { firstName: string, lastName: string, email: string }) => {
      await sendUserInvite(firstName, lastName, email, "VOLUNTEER") // TODO: update for different roles
    },
    onSuccess: () => {
      console.log("Invite sent!")
    },
    onError: (err) => {
      console.error("Failed to send invite")
      console.error(err)
    },
    onSettled: () => {
      setShowAddModal(false)
    }
  })

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-100 min-h-screen overflow-x-hidden flex flex-col ${navBarOpen ? "ml-[250px]" : "ml-[60px]"
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
            {
              isPending ? (
                <Loading />
              ) : error ? (
                <p>Something went wrong: {error.message}</p>
              ) : (
                filteredUsers?.map((u) => (
                  <UserCard key={u.auth_id} user={u} />
                ))
              )
            }
          </div>
          <AddAccountModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            onConfirm={(user) => {
              if (!inviteUserMutation.isPending) {
                inviteUserMutation.mutate(user)
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default UserManagementPage;
