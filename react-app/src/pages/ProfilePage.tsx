import React from 'react';
import ContactInfoBox from '../components/ProfilePage/ContactInfoBox';
import PasswordBox from '../components/ProfilePage/PasswordBox';
import ProfileIcon from '../components/ProfilePage/ProfileIcon';

const ProfilePage = ({ initials = "KL", name = "Kim Luu", email = "kiml2726@gmail.com", phone = "585-105-6915" }) => {
  return (
    <div className="min-h-screen bg-[#f2f2f2] flex justify-center px-10 py-16 text-[#222]">
      {/* Main row layout: ProfileIcon | Right content */}
      <div className="flex gap-12">
        {/* Left: Profile icon and name together */}
        <ProfileIcon initials={initials}/>

        {/* Right: Info content */}
        <div className="flex flex-col gap-8 w-[600px]">
        <h2 className="text-2xl font-semibold pt-2">{name}</h2>
          <div>
            <h4 className="font-bold text-lg mb-1">Personal Information</h4>
            <div className="w-full h-[2px] bg-black" />
          </div>

          <ContactInfoBox email = {email} phone = {phone}/>
          <PasswordBox />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
