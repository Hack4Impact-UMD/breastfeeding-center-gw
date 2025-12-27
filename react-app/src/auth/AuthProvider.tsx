import {
  MultiFactorInfo,
  onIdTokenChanged,
  type User as AuthUser,
  type IdTokenResult,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { User as UserProfile } from "@/types/UserType";
import { getUserById } from "@/services/userService";
import { getEnrolledMFAMethods } from "@/services/authService";

interface Props {
  children: React.JSX.Element;
}

interface AuthContextType {
  authUser: AuthUser | null;
  profile: UserProfile | null;
  token: IdTokenResult | null;
  loading: boolean;
  isAuthed: boolean;
  refreshAuth: () => Promise<void>;
  mfaMethods: MultiFactorInfo[];
}

const refreshAuth = async () => {
  await auth.currentUser?.reload();
  await auth.currentUser?.getIdToken(true);
};

// The AuthContext that other components may subscribe to.
const AuthContext = createContext<AuthContextType>({
  loading: true,
  authUser: null,
  profile: null,
  token: null,
  isAuthed: false,
  refreshAuth,
  mfaMethods: [],
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
    refreshAuth,
    mfaMethods: [],
  });

  useEffect(() => {
    return onIdTokenChanged(auth, async (newUser) => {
      if (newUser != null) {
        const token = await newUser.getIdTokenResult().catch((err) => {
          console.error("Failed to get ID token!");
          console.error(err);
          return null;
        });

        const profile = await getUserById(newUser.uid).catch((err) => {
          console.warn("User profile is not found");
          console.warn(err);
          return null;
        });

        if (profile === null) {
          setAuthState({
            authUser: null,
            token: null,
            loading: false,
            profile: null,
            isAuthed: false,
            refreshAuth,
            mfaMethods: [],
          });
        } else {
          setAuthState({
            authUser: newUser,
            token,
            loading: false,
            profile,
            isAuthed: true,
            refreshAuth,
            mfaMethods: getEnrolledMFAMethods(),
          });
        }
      } else {
        setAuthState({
          authUser: null,
          token: null,
          loading: false,
          profile: null,
          isAuthed: false,
          refreshAuth,
          mfaMethods: [],
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
