import React from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthProvider";
import Loading from "../components/Loading";
import { isMfaEnrolled } from "@/services/authService";

interface Props {
  children: React.JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const authContext = useAuth();
  if (authContext.loading) {
    return (
      <div className="h-screen w-screen">
        <Loading />;
      </div>
    );
  } else if (!authContext.authUser) {
    return <Navigate to="/login" state={{ redir: window.location.pathname }} />;
  } else if (!authContext.authUser.emailVerified) {
    return <Navigate to="/verify" />
  } else if (!isMfaEnrolled(authContext.profile)) {
    return <Navigate to="/mfa-enroll" />
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default RequireAuth;
