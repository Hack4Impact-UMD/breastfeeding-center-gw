import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import ConfirmPasswordPopup from "./ConfirmPasswordPopup";
import ProfileIcon from "../../components/ProfileIcon";

const ProfilePage = () => {
  const [initials] = useState("VT");
  const [name] = useState("Volunteer");
  const [pronouns] = useState("She/Her/Hers");
  const [email] = useState("kim@gmail.com");
  const [phone] = useState("585-105-6915");
  const [editType, setEditType] = useState("Email");
  const [openConfirmPasswordModal, setOpenConfirmPasswordModal] =
    useState(false);

  return (
    <div className="flex flex-col gap-8 justify-center px-10 sm:px-20 py-16 ">
      <div className="w-full">
        <div className="flex items-center gap-4 md:gap-6">
          <ProfileIcon initials={initials} />
          <div className="flex flex-col md:flex-row md:gap-4 md:items-end">
            <h1 className="font-normal text-3xl md:text-5xl leading-tight text-left">
              {name}
            </h1>
            <div className="flex items-center gap-2 text-sm mb-2">
              ({pronouns})
              <FaEdit className="cursor-pointer text-gray-600 text-sm" />
            </div>
          </div>
        </div>

        <h4 className="mt-6 font-semibold font-Montserrat text-lg text-left">
          Personal Information
        </h4>
        <div className="w-full h-[4px] bg-bcgw-yellow-dark" />
      </div>

      <div className="bg-transparent md:bg-white md:border md:border-gray-300 md:rounded-md md:shadow-sm md:p-6 text-left">
        <h5 className="font-bold mb-4">E-MAIL AND PHONE NUMBER</h5>
        <p className="text-xs text-gray-600 mb-4">
          The linked email and phone number below will be used for signing in
          and for two-factor authentication to help keep your account secure.
        </p>

        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-sm w-24">Email</p>
          <p className="text-sm text-black flex-1">{email}</p>
          <FaEdit
            className="cursor-pointer text-gray-600"
            onClick={() => {
              setEditType("Email");
              setOpenConfirmPasswordModal(true);
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm w-24">Phone</p>
          <p className="text-sm text-black flex-1">{phone}</p>
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
        <h5 className="font-bold mb-4">PASSWORD</h5>
        <p className="text-xs text-gray-600 mb-4">
          Heads up! You will be asked to log in to dashboard again before and
          after making any changes to your email address or password to ensure a
          secure and complete update.
        </p>

        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm w-40">Current Password</p>
          <p className="text-sm text-black flex-1">**********</p>
          <FaEdit
            className="cursor-pointer text-gray-600"
            onClick={() => {
              setEditType("Password");
              setOpenConfirmPasswordModal(true);
            }}
          />
        </div>
      </div>

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
