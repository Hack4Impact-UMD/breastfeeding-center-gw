import {
  onIdTokenChanged,
  type User,
  type IdTokenResult,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

interface Props {
  children: React.JSX.Element;
}

interface AuthContextType {
  user: User | null;
  token: IdTokenResult | null;
  loading: boolean;
}

// The AuthContext that other components may subscribe to.
const AuthContext = createContext<AuthContextType>(null!);

// Updates the AuthContext and re-renders children when the user changes.
// See onIdTokenChanged for what events trigger a change.
export const AuthProvider = ({ children }: Props): React.ReactElement => {
  const [authState, setAuthState] = useState<AuthContextType>({
    loading: true,
    token: null,
    user: null
  })

  useEffect(() => {
    return onIdTokenChanged(auth, async (newUser) => {
      if (newUser != null) {
        const token = await newUser.getIdTokenResult()
          .catch((err) => {
            console.error("Failed to get ID token!");
            console.error(err);
            return null;
          });

        setAuthState({
          user: newUser,
          token,
          loading: false
        })
      } else {
        setAuthState({
          user: null,
          token: null,
          loading: false
        })
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
