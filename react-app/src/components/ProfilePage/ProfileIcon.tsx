import React from 'react';

const ProfileIcon = ({ initials = "KL" }) => {
    return (
      <div className="w-50 h-50 rounded-full bg-yellow-400 flex items-center justify-center text-2xl font-semibold text-black">
         <span className="text-black font-thin text-[5rem] leading-none">
            {initials}
        </span>
      </div>
    );
  };
  
  export default ProfileIcon;