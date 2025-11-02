import { FormEvent, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useInvite } from "@/hooks/queries/useInvite";
import Loading from "@/components/Loading";

import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { PASSWORD_REQUIREMENTS, validatePassword } from "@/lib/passwordUtils";
import { useRegisterUser } from "@/hooks/mutations/useRegisterUser";
import { Button } from "@/components/ui/button";

const PRONOUN_OPTIONS = ["she/her", "he/him", "they/them", "Other", "None"];

function validatePhone(phone: string) {
  const regex = /^\+?\d{10,14}$/gim;
  return regex.test(phone);
}

export default function NewUserPage() {
  const { inviteId = "" } = useParams();

  const { data: invite, isPending, error } = useInvite(inviteId);
  const {
    mutate: register,
    isPending: registerPending,
    error: registerError,
  } = useRegisterUser();

  const prefilledFirstName = invite?.firstName ?? "";
  const prefilledLastName = invite?.lastName ?? "";
  const prefilledEmail = invite?.email ?? "";

  const [firstName, setFirstName] = useState(prefilledFirstName);
  const [lastName, setLastName] = useState(prefilledLastName);
  const [pronouns, setPronouns] = useState(PRONOUN_OPTIONS[0]);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [formError, setError] = useState("");

  const isPhoneValid = phone === "" || validatePhone(phone);
  const isPasswordValid = password === "" || validatePassword(password);
  const doPasswordsMatch = password === confirmPassword;

  // needed to update the state vars after the invite data is fetched
  useEffect(() => {
    setFirstName(prefilledFirstName);
    setLastName(prefilledLastName);
  }, [prefilledFirstName, prefilledLastName]);

  const allFieldsFilled =
    !!firstName.trim() &&
    !!lastName.trim() &&
    !!phone.trim() &&
    !!password &&
    !!confirmPassword;

  const INVALID_MESSAGE =
    "One or more fields is invalid. Please re-enter phone or password fields to create an account.";

  if (isPending)
    return (
      <div className="p-2 w-full h-full flex items-center justify-center">
        <Loading />
      </div>
    );

  if (error) return <Navigate to="/" />;

  if (!invite.valid) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <img src="/bcgw-logo.png" alt="logo" className="size-32 mb-4" />
        <h1 className="text-4xl font-semibold mb-2 text-center">
          Invalid Invite
        </h1>
        <p className="text-center text-lg">
          This invite has either expired or been used.
        </p>
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setError(INVALID_MESSAGE);
      return;
    }
    if (!validatePassword(password)) {
      setError(INVALID_MESSAGE);
      return;
    }
    if (password !== confirmPassword) {
      setError(INVALID_MESSAGE);
      return;
    }

    if (!invite) {
      setError("No invite found!");
      return;
    }

    setError("");

    register({
      inviteId: invite.id,
      form: {
        email: invite.email,
        firstName: firstName,
        lastName: lastName,
        pronouns: pronouns,
        password: password,
        phone: phone,
      },
    });
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-white">
      <img src="/bcgw-logo.png" alt="logo" className="w-16 mb-4" />
      <h1
        className="font-semibold mb-6 text-center"
        style={{ fontSize: "28px" }}
      >
        Welcome new user!
      </h1>
      <form
        className="w-full max-w-lg flex flex-col gap-4"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="font-medium mb-1 flex items-center">
              <span className="text-red-500 mr-2">*</span>
              <span>First Name</span>
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="font-medium mb-1 flex items-center">
              <span className="text-red-500 mr-2">*</span>
              <span>Last Name</span>
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="font-medium mb-1 flex items-center">
              <span className="invisible mr-2">*</span>
              <span>Pronouns</span>
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
            >
              {PRONOUN_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="font-medium mb-1 flex items-center">
            <span className="text-red-500 mr-2">*</span>
            <span>Phone Number</span>
          </label>
          <input
            className={`w-full border rounded px-3 py-2 ${phone && !isPhoneValid ? "border-red-500" : ""}`}
            placeholder="(XXX) - XXX - XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            inputMode="tel"
          />
        </div>

        <div>
          <label className="font-medium mb-1 flex items-center">
            <span>Email</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-400 cursor-not-allowed"
            value={prefilledEmail}
            disabled
          />
        </div>

        <div>
          <label className="font-medium mb-1 flex items-center">
            <span className="text-red-500 mr-2">*</span>
            <span className="mr-2">Password</span>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-lg text-[#0F4374] hover:opacity-90"
                  aria-label="Password requirements"
                >
                  <AiOutlineInfoCircle />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="p-0 border-0 bg-transparent rounded text-sm"
              >
                <div className="bg-[#0F4374] text-white p-3 rounded-lg shadow-md">
                  <ul className="text-sm list-disc list-inside">
                    {PASSWORD_REQUIREMENTS.map((req) => (
                      <li key={req} className="leading-tight">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </label>

          <div className="relative">
            <input
              className={`w-full border rounded px-4 py-3 ${password && !isPasswordValid ? "border-red-500" : ""}`}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <IoMdEyeOff className="w-5 h-5" />
              ) : (
                <IoMdEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="font-medium mb-1 flex items-center">
            <span className="text-red-500 mr-2">*</span>
            <span>Confirm Password</span>
          </label>
          <div className="relative">
            <input
              className={`w-full border rounded px-4 py-3 ${confirmPassword && !doPasswordsMatch ? "border-red-500" : ""}`}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <IoMdEyeOff className="w-5 h-5" />
              ) : (
                <IoMdEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button
            type="submit"
            variant={"yellow"}
            disabled={!allFieldsFilled || registerPending}
          >
            Create Account
          </Button>
        </div>
        {formError && (
          <div className="text-red-500 text-center text-sm mt-4">
            {formError}
          </div>
        )}
        {registerError && (
          <div className="text-red-500 text-center text-sm mt-4">
            Failed to register user: {registerError.message}
          </div>
        )}
      </form>
    </div>
  );
}
