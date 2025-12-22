import { useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import ConfirmPasswordPopup from "./ConfirmPasswordPopup";
import ProfileIcon from "../../components/ProfileIcon";
import ChangeNamePronounsPopup from "./ChangeNamePronounsPopup";
import { useAuth } from "@/auth/AuthProvider";
import { MultiFactorInfo } from "firebase/auth";
import { AsteriskIcon, PhoneIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUnenrollMFAMethod } from "@/hooks/mutations/useUnenrollMFAMethod";

const ProfilePage = () => {
  const { profile, mfaMethods } = useAuth();

  const { mutate: unenrollMethod } = useUnenrollMFAMethod();

  const firstName = profile?.firstName ?? "";
  const lastName = profile?.lastName ?? "";
  const email = profile?.email ?? "";
  const phone = profile?.phone ?? "";
  const pronouns = profile?.pronouns ?? "";

  const initials = useMemo(
    () =>
      `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`,
    [firstName, lastName],
  );

  const [editType, setEditType] = useState<"Email" | "Phone" | "Password">(
    "Email",
  );
  const [openConfirmPasswordModal, setOpenConfirmPasswordModal] =
    useState(false);
  const [openNamePronounsModal, setOpenNamePronounsModal] = useState(false);

  const displayName = `${firstName} ${lastName}`;

  return (
    <div className="flex flex-col gap-8 justify-center py-14 px-10 sm:px-20">
      <>
        <div className="w-full">
          <div className="flex items-center gap-4 md:gap-6">
            <ProfileIcon initials={initials} />
            <div className="flex flex-col lg:flex-row lg:gap-4 lg:items-end">
              <h1 className="font-normal text-4xl lg:text-5xl leading-tight text-left">
                {displayName}
              </h1>
              <div className="flex items-center gap-2 text-lg mb-2">
                {pronouns !== "" ? `(${pronouns})` : ""}
                <FaEdit
                  className="cursor-pointer text-gray-600 text-lg"
                  onClick={() => setOpenNamePronounsModal(true)}
                />
              </div>
            </div>
          </div>

          <h4 className="mt-6 font-semibold font-Montserrat text-lg text-left">
            Personal Information
          </h4>
          <div className="w-full h-[4px] bg-bcgw-yellow-dark" />
        </div>

        <div className="bg-transparent md:bg-white md:border md:border-gray-300 md:rounded-md md:shadow-sm md:p-6 text-left">
          <h5 className="font-bold mb-4 text-base sm:text-lg">
            E-MAIL AND PHONE NUMBER
          </h5>
          <p className="text-sm text-gray-600 mb-4">
            The linked email and phone number below will be used for signing in
            and for two-factor authentication to help keep your account secure.
          </p>

          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-sm sm:text-base w-24">Email</p>
            <p className="text-sm sm:text-base text-black flex-1">{email}</p>
            <FaEdit
              className="cursor-pointer text-gray-600"
              onClick={() => {
                setEditType("Email");
                setOpenConfirmPasswordModal(true);
              }}
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm sm:text-base w-24">Phone</p>
            <p className="text-sm sm:text-base text-black flex-1">{phone}</p>
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
          <h5 className="font-bold mb-4 text-base sm:text-lg">PASSWORD</h5>
          <p className="text-sm text-gray-600 mb-4">
            Heads up! You will be asked to input your password before making any
            changes to your email address or password to ensure a secure and
            complete update.
          </p>

          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm sm:text-base w-40">
              Current Password
            </p>
            <p className="text-sm sm:text-base text-black flex-1">**********</p>
            <FaEdit
              className="cursor-pointer text-gray-600"
              onClick={() => {
                setEditType("Password");
                setOpenConfirmPasswordModal(true);
              }}
            />
          </div>
        </div>

        <div className="bg-transparent md:bg-white md:border md:border-gray-300 md:rounded-md md:shadow-sm md:p-6 text-left">
          <h5 className="font-bold mb-4 text-base sm:text-lg">2FA Methods</h5>
          <p className="text-sm text-gray-600 mb-4">
            The 2FA methods associated with your account are listed below. You must have one method enrolled with the same phone number as the one currently used for your account ({phone}).
          </p>

          <div className="flex flex-col gap-2">
            {mfaMethods.map((hint: MultiFactorInfo & { phoneNumber?: string }) => (
              <div key={hint.uid} className="flex gap-4 items-center">
                {hint.factorId === "phone" ? <PhoneIcon className="size-4" /> : <AsteriskIcon className="size-4" />}
                <div className="grow">
                  <p className="font-semibold text-sm sm:text-base">
                    {hint.displayName}
                  </p>
                  {hint.phoneNumber &&
                    <span className="text-sm sm:text-base text-black flex-1">{hint.phoneNumber}</span>
                  }
                </div>
                <Button variant="outline" size="sm" disabled={hint.phoneNumber === phone}
                  onClick={() => unenrollMethod(hint)}
                >
                  <XIcon
                    className="cursor-pointer text-gray-600"
                  />
                  Unenroll
                </Button>
              </div>
            ))}
          </div>
        </div>
      </>

      <ChangeNamePronounsPopup
        open={openNamePronounsModal}
        onClose={() => setOpenNamePronounsModal(false)}
        initialFirstName={firstName}
        initialLastName={lastName}
        initialPronouns={pronouns}
      />

      <ConfirmPasswordPopup
        open={openConfirmPasswordModal}
        onClose={() => setOpenConfirmPasswordModal(false)}
        editType={editType}
      />
    </div>
  );
};

export default ProfilePage;
