import { useState } from "react";
import ContactInfoBox from "./ContactInfoPopup";
import PasswordBox from "./PasswordPopup";
import ProfileIcon from "./ProfileIcon";
import Header from "../../components/header";
import NavigationBar from "../../components/NavigationBar/NavigationBar";

const ProfilePage = ({
  initials = "KL",
  name = "Kim Luu",
  email = "kiml2726@gmail.com",
  phone = "585-105-6915",
}) => {
  const [navBarOpen, setNavBarOpen] = useState(true);
  // const [initials, setInitials] = useState("KL");
  // const [name, setName] = useState("Kim Luu");
  // const [email, setEmail] = useState("kim@gmail.com");
  // const [phone, setPhone] = useState("585-105-6915");

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]" //set margin of content to 250px when nav bar is open and 60px when closed
        }`}>
        <Header />
        <div className="min-h-screen bg-bcgw-gray-lighter flex justify-center px-10 py-16 text-[#222]">
          {/* Main row layout: ProfileIcon | Right content */}
          <div className="flex gap-12">
            {/* Left: Profile icon and name together */}
            <ProfileIcon initials={initials} />

            {/* Right: Info content */}
            <div className="flex flex-col gap-8 w-[600px]">
              <h2 className="text-2xl font-semibold pt-2">{name}</h2>
              <div>
                <h4 className="font-bold text-lg mb-1">Personal Information</h4>
                <div className="w-full h-[2px] bg-black" />
              </div>

              <ContactInfoBox email={email} phone={phone} />
              <PasswordBox />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
