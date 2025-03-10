import React, { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

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
      <form onSubmit={handleSubmit}>
        <input // input for email 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required/>

        <input // input for password
            type={ visibility? "text" : "password"} // tenary operator to show visibility -- passwword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>

        <button onMouseDown={viewPassword}
        // button to toggle visibility
        // change this to component whatever is implemented 
        >
        {visibility ? (<IoMdEyeOff/>) : (<IoMdEye/>)}
        </button>

        <button type="submit">Sign in</button> 
    </form>
    </>
        
    );
};

export default LoginPage;