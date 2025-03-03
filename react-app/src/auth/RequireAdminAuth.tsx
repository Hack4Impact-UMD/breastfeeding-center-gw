import React from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthProvider";
import Loading from "../components/Loading";

interface Props {
  children: React.JSX.Element;
}

const containerStyle =
  "h-screen w-screen flex flex-row items-center justify-center";

const RequireAdminAuth: React.FC<Props> = ({ children }) => {
  const authContext = useAuth();
  if (authContext.loading) {
    return (
      <div className={containerStyle}>
        <Loading />;
      </div>
    );
  } else if (!authContext.user) {
    return <Navigate to="/login" state={{ redir: window.location.pathname }} />;
  } else if (authContext.token?.claims?.role != "ADMIN") {
    return (
      <div className={containerStyle}>
        <p className="text-center">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default RequireAdminAuth;
