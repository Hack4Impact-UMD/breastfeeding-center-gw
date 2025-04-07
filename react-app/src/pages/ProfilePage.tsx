import React from 'react';
import ProfileHeader from '../components/ProfilePage/ProfileHeader';
import ContactInfoBox from '../components/ProfilePage/ContactInfoBox';
import PasswordBox from '../components/ProfilePage/PasswordBox';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-[#f2f2f2] flex justify-center px-10 py-16 text-[#222]">
      {/* Main row layout: ProfileIcon | Right content */}
      <div className="flex gap-12">
        {/* Left: Profile icon and name together */}
        <ProfileHeader initials="KL" name="Kim Luu" />

        {/* Right: Info content */}
        <div className="flex flex-col gap-8 w-[600px]">
          <div>
            <h4 className="font-bold text-lg mb-1">Personal Information</h4>
            <div className="w-full h-[2px] bg-black" />
          </div>

          <ContactInfoBox />
          <PasswordBox />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
