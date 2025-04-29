const ProfileIcon = ({ initials }: { initials: string }) => {
  return (
    <div className="w-50 h-50 rounded-full bg-bcgw-yellow-dark flex items-center justify-center">
      <span className="text-bcgw-blue-dark font-normal text-[5rem] leading-none">
        {initials}
      </span>
    </div>
  );
};

export default ProfileIcon;
