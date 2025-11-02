import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import ConfirmPasswordPopup from "./ConfirmPasswordPopup";
import ProfileIcon from "../../components/ProfileIcon";

const ProfilePage = () => {
  const [initials] = useState("VT");
  const [name] = useState("Volunteer Tester");
  const [email] = useState("kim@gmail.com");
  const [phone] = useState("585-105-6915");
  const [editType, setEditType] = useState("Email"); // email or password
  const [openConfirmPasswordModal, setOpenConfirmPasswordModal] =
    useState(false);

  return (
    <div className="bg-bcgw-gray-lighter">
      <div className="flex justify-center px-10 py-16 text-black">
        {/* Main row layout: ProfileIcon | Right content */}
        <div className="flex gap-12 flex-col lg:flex-row items-center lg:items-start">
          {/* Left: Profile icon and name together */}
          <ProfileIcon initials={initials} />

          {/* Right: Info content */}
          <div className="flex flex-col gap-8 w-[300px] sm:w-[500px] md:w-[600px] lg:w-[600px] items-center lg:items-start text-center sm:text-left">
            <div>
              <h1 className="mb-0">{name}</h1>
              <h4 className="font-semibold font-Montserrat text-lg mb-1 text-center lg:text-left">
                Personal Information
              </h4>
              <div className="w-full h-[2px] bg-black" />
            </div>

            {/* Email & Phone Number Box */}
            <div className="bg-white border border-gray-300 p-6 rounded-md shadow-sm">
              <h5 className="font-bold mb-4">E-MAIL AND PHONE NUMBER</h5>
              <p className="text-xs text-gray-600 mb-4">
                The linked email and phone number below will be used for
                signing in and for two-factor authentication to help keep your
                account secure.
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
                <FaEdit className="cursor-pointer text-gray-600" />
              </div>
            </div>

            {/* Password Box */}
            <div className="bg-white border border-gray-300 p-6 rounded-md shadow-sm">
              <h5 className="font-bold mb-4">PASSWORD</h5>
              <p className="text-xs text-gray-600 mb-4">
                Heads up! You will be asked to log in to dashboard again
                before and after making any changes to your email address or
                password to ensure a secure and complete update.
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
