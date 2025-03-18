import React, { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Logo from '../assets/bcgw-logo.png';

const LoginPage = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visibility, setVisilibty] = useState(false);
    // integrate emailError with HTML element 
    const [emailError, setEmailError] = useState("");
    const [passError, setPassError] = useState("");

    const viewPassword = () => {
        setVisilibty(true)
    }

    // Email and Password inputs have required, so handleSubmit 
    // only handles validity of email
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let emailValid = true;
        let passwordValid = true;

        if (!regex.test(email)) {
            setEmailError("Email is invalid. Please input valid email.")
            emailValid = false;
        } else if (!email) {
            setEmailError("Email is required.");
            emailValid = false;
        } else if (!password) {
            setPassError("Password is required");
            passwordValid = false;
        }

        if (emailValid && passwordValid) {
            console.log("everything is valid!");
        }
        return emailValid && passwordValid;
    }

    return (
        <>
            <div className="font-sans">
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">

                        <div className="flex flex-col items-center mb-6">
                            <img src={Logo} className="w-25 h-30 mb-4" />
                            <h2 className="text-3xl ">Log In</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <input // input for email 
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border mb-4"
                            />

                            <div className="relative mb-2">
                                <input // input for password
                                    type={visibility ? "text" : "password"} // tenary operator to show visibility -- passwword
                                    value={password}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border"
                                />
                                <button
                                    type="button"
                                    onClick={viewPassword}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                    {visibility ? (<IoMdEyeOff />) : (<IoMdEye />)}
                                </button>
                            </div>

                            <div className="mt-1 mb-4">
                                <button
                                    type="button"
                                    className="text-xs text-black hover:underline tracking-wide"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    type="submit"
                                    className="
                                    bg-[#f4bb47]
                                    text-black
                                    font-bold 
                                    py-3
                                    px-12
                                    rounded-full
                                    transition
                                    "
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    );
};

export default LoginPage;