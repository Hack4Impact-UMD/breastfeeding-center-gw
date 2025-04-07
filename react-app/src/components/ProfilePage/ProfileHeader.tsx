import React from 'react';
import ProfileIcon from './ProfileIcon';

const ProfileHeader = ({ initials = 'KL', name = 'Kim Luu' }) => {
  return (
    <div className="flex flex-col justify-start items-center pt-2">
      <ProfileIcon initials={initials} />
      <h2 className="text-xl font-bold mt-4">{name}</h2>
    </div>
  );
};

export default ProfileHeader;
