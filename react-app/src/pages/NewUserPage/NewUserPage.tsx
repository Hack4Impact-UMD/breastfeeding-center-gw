import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineInfoCircle } from "react-icons/ai";

const PRONOUN_OPTIONS = [
  "she/her",
  "he/him",
  "they/them",
  "Other",
  "None",
];

const PASSWORD_REQUIREMENTS = [
  "At least 8 characters",
  "At least one uppercase letter",
  "At least one lowercase letter",
  "At least one number",
  "At least one special character",
];

function validatePassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function validatePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10;
}

export default function NewUserPage() {
  const prefilledFirstName = "Monica";
  const prefilledLastName = "Williams";
  const prefilledEmail = "janedoe123@gmail.com";

  const [firstName, setFirstName] = useState(prefilledFirstName);
  const [lastName, setLastName] = useState(prefilledLastName);
  const [pronouns, setPronouns] = useState(PRONOUN_OPTIONS[0]);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isPhoneValid = phone === "" || validatePhone(phone);
  const isPasswordValid = password === "" || validatePassword(password);
  const doPasswordsMatch = password === confirmPassword;

  const allFieldsFilled =
    firstName.trim() &&
    lastName.trim() &&
    phone.trim() &&
    password &&
    confirmPassword;

  const canSubmit =
    allFieldsFilled &&
    validatePhone(phone) &&
    validatePassword(password) &&
    doPasswordsMatch;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Check for validation errors and show appropriate message
    if (!validatePhone(phone)) {
      setError("One or more fields is invalid. Please re-enter phone or email fields to create an account.");
      return;
    }
    if (!validatePassword(password)) {
      setError("One or more fields is invalid. Please re-enter phone or email fields to create an account.");
      return;
    }
    if (password !== confirmPassword) {
      setError("One or more fields is invalid. Please re-enter phone or email fields to create an account.");
      return;
    }
    
    setError("");
    navigate("/register-success");
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-white">
      <img src="/bcgw-logo.png" alt="logo" className="w-16 mb-4" />
      <h1 className="font-semibold mb-6 text-center" style={{ fontSize: '28px' }}>Welcome new user!</h1>
      <form
        className="w-full max-w-lg flex flex-col gap-4"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Pronouns</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={pronouns}
              onChange={e => setPronouns(e.target.value)}
            >
              {PRONOUN_OPTIONS.map(option => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full border rounded px-3 py-2 ${phone && !isPhoneValid ? "border-red-500" : ""}`}
            placeholder="(XXX) - XXX - XXXX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            inputMode="tel"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Email
          </label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-400 cursor-not-allowed"
            value={prefilledEmail}
            disabled
          />
        </div>
        <div className="relative w-[108%]">
          <label className="block font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              className={`flex-1 border rounded px-3 py-2 ${password && !isPasswordValid ? "border-red-500" : ""}`}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="text-2xl text-gray-500 flex-shrink-0 cursor-pointer hover:text-gray-700"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
        </div>
        <div className="relative w-[108%]">
          <label className="block font-medium mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              className={`flex-1 border rounded px-3 py-2 ${confirmPassword && !doPasswordsMatch ? "border-red-500" : ""}`}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="text-2xl text-gray-500 flex-shrink-0 cursor-pointer hover:text-gray-700"
              onClick={() => setShowConfirmPassword(v => !v)}
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className={`px-8 py-2 rounded-full text-white font-semibold transition ${
              allFieldsFilled
                ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!allFieldsFilled}
          >
            Create Account
          </button>
        </div>
        {error && (
          <div className="text-red-500 text-center text-sm mt-4">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}