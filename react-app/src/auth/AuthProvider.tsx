import { onIdTokenChanged, type User as AuthUser, type IdTokenResult } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { User as UserProfile } from "@/types/UserType";
import { getUserById } from "@/backend/UserFunctions";

interface Props {
  children: React.JSX.Element;
}

interface AuthContextType {
  authUser: AuthUser | null;
  profile: UserProfile | null,
  token: IdTokenResult | null;
  loading: boolean;
  isAuthed: boolean;
}

// The AuthContext that other components may subscribe to.
const AuthContext = createContext<AuthContextType>({
  loading: true,
  authUser: null,
  profile: null,
  token: null,
  isAuthed: false,
});

// Updates the AuthContext and re-renders children when the user changes.
// See onIdTokenChanged for what events trigger a change.
export const AuthProvider = ({ children }: Props): React.ReactElement => {
  const [authState, setAuthState] = useState<AuthContextType>({
    loading: true,
    token: null,
    authUser: null,
    profile: null,
    isAuthed: false,
  });

  useEffect(() => {
    return onIdTokenChanged(auth, async (newUser) => {
      if (newUser != null) {
        const token = await newUser.getIdTokenResult().catch((err) => {
          console.error("Failed to get ID token!");
          console.error(err);
          return null;
        });

        const profile = await getUserById(newUser.uid);

        setAuthState({
          authUser: newUser,
          token,
          loading: false,
          profile,
          isAuthed: true,
        });
      } else {
        setAuthState({
          authUser: null,
          token: null,
          loading: false,
          profile: null,
          isAuthed: false
        });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
