import React, { useMemo, useState } from "react";
import UserFilters from "./UserFilters";
import UserCard from "./UserCard";
import AddAccountPopup from "./AddAccountPopup";
import { useAllUsers } from "@/hooks/queries/useUsers";
import Loading from "@/components/Loading";
import { useMutation } from "@tanstack/react-query";
import { sendUserInvite } from "@/services/inviteService";
import { Role } from "@/types/UserType";
import { useAuth } from "@/auth/AuthProvider";

const UserManagementPage: React.FC = () => {
  const auth = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: users, isPending, error } = useAllUsers();

  const singleDirector = useMemo(
    () => (users?.filter((u) => u.type === "DIRECTOR")?.length ?? 0) <= 1,
    [users],
  );

  const filteredUsers = useMemo(
    () =>
      users
        ?.filter((u) => {
          const fullName = `${u.lastName}, ${u.firstName}`.toLowerCase();
          return (
            fullName.includes(search.toLowerCase()) &&
            (roleFilter === "ALL" || u.type === roleFilter)
          );
        })
        .sort((a, b) =>
          (a.lastName || "")
            .toLowerCase()
            .localeCompare((b.lastName || "").toLowerCase()),
        ),
    [users, roleFilter, search],
  );

  const inviteUserMutation = useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      email,
      role,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      role: Role;
    }) => {
      await sendUserInvite(firstName, lastName, email, role);
    },
    onSuccess: () => {
      console.log("Invite sent!");
    },
    onError: (err) => {
      console.error("Failed to send invite");
      console.error(err);
    },
    onSettled: () => {
      setShowAddModal(false);
    },
  });

  return (
    <>
      <div className="flex flex-col px-4 md:px-14 py-14">
        <UserFilters
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          onAddUserClick={() => setShowAddModal(true)}
        />

        <div className="flex justify-between items-center mt-3 pb-2 px-2.5 border-b border-gray-300">
          <div className="text-base font-semibold">User</div>
          {auth.token?.claims?.role !== "VOLUNTEER" ? (
            <div className="text-base font-semibold">Actions</div>
          ) : (
            <></>
          )}
        </div>

        {/* user list */}
        <div className="mt-3">
          {isPending ? (
            <Loading />
          ) : error ? (
            <p>Something went wrong: {error.message}</p>
          ) : (
            filteredUsers?.map((u) => (
              <UserCard
                singleDirector={singleDirector}
                key={u.auth_id}
                user={u}
              />
            ))
          )}
        </div>
        <AddAccountPopup
          disabled={inviteUserMutation.isPending}
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onConfirm={(user) => {
            if (!inviteUserMutation.isPending) {
              inviteUserMutation.mutate(user);
            }
          }}
          profile={auth.profile}
        />
      </div>
    </>
  );
};

export default UserManagementPage;
