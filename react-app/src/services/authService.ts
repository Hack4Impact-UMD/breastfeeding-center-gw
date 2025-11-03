import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  type AuthError,
  type User,
} from "firebase/auth";
import { auth, functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";
import { axiosClient } from "@/lib/utils";

/*
 * Creates a admin user
 */
export async function createAdminUser(
  newEmail: string,
  newFirstName: string,
  newLastName: string,
): Promise<void> {
  const axios = await axiosClient();

  await axios.post("/auth/create/admin", {
    email: newEmail,
    firstName: newFirstName,
    lastName: newLastName,
  });

  await sendPasswordResetEmail(auth, newEmail);
}

export function authenticateUserEmailAndPassword(
  email: string,
  password: string,
): Promise<User> {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        resolve(userCredential.user);
      })
      .catch((error: AuthError) => {
        reject(error);
      });
  });
}

export function updateUserEmail(
  oldEmail: string,
  currentEmail: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const updateUserEmailCloudFunction = httpsCallable(
      functions,
      "updateUserEmail",
    );

    updateUserEmailCloudFunction({ email: oldEmail, newEmail: currentEmail })
      .then(async () => {
        resolve();
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

/*
  Updates the logged-in user's password.
  Shouldn't face the re-authentication issue because password is provided to re-authenticate within the function.
  
  TODO: make error messages change properly.
   */
export async function updateUserPassword(
  newPassword: string,
  oldPassword: string,
): Promise<string> {
  return await new Promise((resolve, reject) => {
    const user = auth.currentUser;

    if (user != null) {
      const credential = EmailAuthProvider.credential(user.email!, oldPassword);
      reauthenticateWithCredential(user, credential)
        .then(async () => {
          updatePassword(user, newPassword)
            .then(() => {
              resolve("Successfully updated password");
            })
            .catch((error) => {
              const code = (error as AuthError).code;
              if (code === "auth/weak-password") {
                reject("New password should be at least 6 characters");
              } else {
                reject("Error updating password. Please try again later.");
              }
            });
        })
        .catch((error) => {
          const code = (error as AuthError).code;
          if (code === "auth/wrong-password") {
            reject("Your original password is incorrect.");
          } else if (code === "auth/too-many-request") {
            reject(`Access to this account has been temporarily disabled due to many failed
              login attempts or due to too many failed password resets. Please try again later`);
          } else {
            reject("Failed to authenticate user. Please log in again.");
          }
        });
    } else {
      reject("Session expired. Please sign in again.");
    }
  });
}

export function sendResetEmail(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/*
 * Deletes a user given their auth id
 */
export async function deleteUser(auth_id: string): Promise<void> {
  const axios = await axiosClient();
  await axios.delete(`/auth/user/${auth_id}`);
}

export function logOut(): Promise<void> {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
