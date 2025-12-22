import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  type AuthError,
  type User,
  multiFactor,
  MultiFactorInfo,
  RecaptchaVerifier,
  PhoneAuthProvider,
  MultiFactorResolver,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { axiosClient } from "@/lib/utils";
import { CurrencyIcon } from "lucide-react";

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

export async function reauthenticateUser(pass: string) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("Not authenticated!");

  const cred = EmailAuthProvider.credential(user.email, pass);

  return await reauthenticateWithCredential(user, cred);
}

export async function sendPasswordReset(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export function isMfaEnrolled(user: User) {
  const multifactor = multiFactor(user);
  const enrolledFactors = multifactor.enrolledFactors

  // ensure that the user's registered phone number on firebase auth is enrolled in mfa, otherwise force enrollment
  // this is primarily used to re-enroll when the user updates their phone number
  return enrolledFactors && enrolledFactors
    .some((factor: MultiFactorInfo & { phoneNumber?: string }) => factor.factorId === "phone" &&
      factor.phoneNumber === user.phoneNumber);
}

export async function sendSMSMFACode(hint: MultiFactorInfo, verifier: RecaptchaVerifier, resolver: MultiFactorResolver) {
  const phoneInfoOptions = {
    multiFactorHint: hint,
    session: resolver.session,
  };

  const phoneAuthProvider = new PhoneAuthProvider(auth);
  const newVerificationId = await phoneAuthProvider.verifyPhoneNumber(
    phoneInfoOptions,
    verifier
  );

  return newVerificationId;
}

export async function verifySMSMFACode(verificationId: string, verificationCode: string, resolver: MultiFactorResolver) {
  const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
  const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
  await resolver.resolveSignIn(multiFactorAssertion);
}

export function initRecaptchaVerifier() {
  const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    'size': 'invisible',
    'callback': () => { console.log('recaptcha resolved..') }
  });
  verifier.render();
  return verifier;
}

export function getEnrolledMFAMethods() {
  if (!auth.currentUser) throw new Error("Not authenticated");
  const multiFactorUser = multiFactor(auth.currentUser);
  const options = multiFactorUser.enrolledFactors;

  return options;
}
