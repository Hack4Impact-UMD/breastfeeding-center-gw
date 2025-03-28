import React from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthProvider";
import Loading from "../components/Loading";

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
  } else if (!authContext.user) {
    return <Navigate to="/login" state={{ redir: window.location.pathname }} />;
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default RequireAuth;
