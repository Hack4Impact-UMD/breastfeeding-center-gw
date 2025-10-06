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
    if (!validatePhone(phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password does not meet requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    navigate("/register-success");
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-white">
      <img src="/bcgw-logo.png" alt="logo" className="w-16 mb-4" />
      <h1 className="text-3xl font-semibold mb-6 text-center">Welcome new user!</h1>
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
        <div className="relative">
          <label className="block font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              className={`w-full border rounded px-3 py-2 pr-10 ${password && !isPasswordValid ? "border-red-500" : ""}`}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-8 top-1/2 -translate-y-1/2 text-xl text-gray-500"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xl text-gray-500"
              onClick={() => setShowPasswordInfo(v => !v)}
              tabIndex={-1}
              aria-label="Password requirements"
            >
              <AiOutlineInfoCircle />
            </button>
          </div>
          {showPasswordInfo && (
            <ul className="mt-2 ml-1 text-xs bg-gray-50 border rounded p-2 shadow">
              {PASSWORD_REQUIREMENTS.map(req => (
                <li key={req} className="text-gray-700">• {req}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative">
          <label className="block font-medium mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              className={`w-full border rounded px-3 py-2 pr-10 ${confirmPassword && !doPasswordsMatch ? "border-red-500" : ""}`}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xl text-gray-500"
              onClick={() => setShowConfirmPassword(v => !v)}
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className={`mt-4 w-full py-2 rounded text-white font-semibold transition ${
            canSubmit
              ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!canSubmit}
        >
          Create Account
        </button>
        {error && (
          <div className="text-red-500 text-center text-sm mt-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}