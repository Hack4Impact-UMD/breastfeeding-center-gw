import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import ConfirmPasswordPopup from "./ConfirmPasswordPopup";
import ProfileIcon from "../../components/ProfileIcon";
import ChangeNamePronounsPopup from "./ChangeNamePronounsPopup";
import { useAuth } from "@/auth/AuthProvider";
import Loading from "../../components/Loading.tsx";

const ProfilePage = () => {
  const auth = useAuth();
  const [initials, setInitials] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editType, setEditType] = useState("Email");
  const [loading, setLoading] = useState<boolean>(true);
  const [openConfirmPasswordModal, setOpenConfirmPasswordModal] =
    useState(false);
  const [openNamePronounsModal, setOpenNamePronounsModal] = useState(false);

  const displayName = `${firstName} ${lastName}`;

  useEffect(() => {
    if (!auth.loading) {
      const user = auth.profile;
      setFirstName(user?.firstName ?? "");
      setLastName(user?.lastName ?? "");
      setPronouns(user?.pronouns ?? "");
      setEmail(user?.email ?? "");
      setPhone(user?.phone ?? "");
      const initials =
        `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();
      setInitials(initials);
      setLoading(false);
    }
  }, [auth.loading, auth.profile]);

  return (
    <div className="flex flex-col gap-8 justify-center py-14 px-10 sm:px-20">
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="w-full">
            <div className="flex items-center gap-4 md:gap-6">
              <ProfileIcon initials={initials} />
              <div className="flex flex-col lg:flex-row lg:gap-4 lg:items-end">
                <h1 className="font-normal text-4xl lg:text-5xl leading-tight text-left">
                  {displayName}
                </h1>
                <div className="flex items-center gap-2 text-lg mb-2">
                  {pronouns !== "" ? `(${pronouns})` : ""}
                  <FaEdit
                    className="cursor-pointer text-gray-600 text-lg"
                    onClick={() => setOpenNamePronounsModal(true)}
                  />
                </div>
              </div>
            </div>

            <h4 className="mt-6 font-semibold font-Montserrat text-lg text-left">
              Personal Information
            </h4>
            <div className="w-full h-[4px] bg-bcgw-yellow-dark" />
          </div>

          <div className="bg-transparent md:bg-white md:border md:border-gray-300 md:rounded-md md:shadow-sm md:p-6 text-left">
            <h5 className="font-bold mb-4 text-base sm:text-lg">
              E-MAIL AND PHONE NUMBER
            </h5>
            <p className="text-sm text-gray-600 mb-4">
              The linked email and phone number below will be used for signing
              in and for two-factor authentication to help keep your account
              secure.
            </p>

            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-sm sm:text-base w-24">Email</p>
              <p className="text-sm sm:text-base text-black flex-1">{email}</p>
              <FaEdit
                className="cursor-pointer text-gray-600"
                onClick={() => {
                  setEditType("Email");
                  setOpenConfirmPasswordModal(true);
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="font-semibold text-sm sm:text-base w-24">Phone</p>
              <p className="text-sm sm:text-base text-black flex-1">{phone}</p>
              <FaEdit
                className="cursor-pointer text-gray-600"
                onClick={() => {
                  setEditType("Phone");
                  setOpenConfirmPasswordModal(true);
                }}
              />
            </div>
          </div>

          <div className="w-full h-[2px] bg-black mt-3 md:hidden" />

          {/* Password Box */}
          <div className="bg-transparent md:bg-white md:border md:border-gray-300 md:rounded-md md:shadow-sm md:p-6 text-left">
            <h5 className="font-bold mb-4 text-base sm:text-lg">PASSWORD</h5>
            <p className="text-sm text-gray-600 mb-4">
              Heads up! You will be asked to log in to dashboard again before
              and after making any changes to your email address or password to
              ensure a secure and complete update.
            </p>

            <div className="flex justify-between items-center">
              <p className="font-semibold text-sm sm:text-base w-40">
                Current Password
              </p>
              <p className="text-sm sm:text-base text-black flex-1">
                **********
              </p>
              <FaEdit
                className="cursor-pointer text-gray-600"
                onClick={() => {
                  setEditType("Password");
                  setOpenConfirmPasswordModal(true);
                }}
              />
            </div>
          </div>
        </>
      )}

      <ChangeNamePronounsPopup
        open={openNamePronounsModal}
        onClose={() => setOpenNamePronounsModal(false)}
        initialFirstName={firstName}
        initialLastName={lastName}
        initialPronouns={pronouns}
      />

      <ConfirmPasswordPopup
        open={openConfirmPasswordModal}
        onClose={setOpenConfirmPasswordModal}
        editType={editType}
        email={email}
        phone={phone}
      />
    </div>
  );
};

export default ProfilePage;
