// src/components/ProfileIcon.tsx
import React from "react";

type ProfileIconProps = {
  initials?: string;
  size?: number;
};

const ProfileIcon: React.FC<ProfileIconProps> = ({
  initials = "",
  size = 112,
}) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
      className={`border-[3px] rounded-full flex items-center justify-center bg-bcgw-yellow-dark border-black`}
    >
      {initials ? (
        <span
          className={`text-blue-dark leading-none`}
          style={{
            fontSize: Math.round(size / 2.2),
          }}
        >
          {initials}
        </span>
      ) : null}
    </div>
  );
};

export default ProfileIcon;
