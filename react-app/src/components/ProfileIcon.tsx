// src/components/ProfileIcon.tsx
import React from "react";

type ProfileIconProps = {
  initials?: string;
  size?: number; // pixels
};

const ProfileIcon: React.FC<ProfileIconProps> = ({
  initials = "",
  size = 112, // default larger
}) => {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderWidth: 3, // black border
  };

  return (
    <div
      className="rounded-full flex items-center justify-center bg-bcgw-yellow-dark border-black"
      style={style}
    >
      {initials ? (
        <span
          className="text-blue-dark"
          style={{
            fontSize: Math.round(size / 2.2),
            lineHeight: 1,
          }}
        >
          {initials}
        </span>
      ) : null}
    </div>
  );
};

export default ProfileIcon;
