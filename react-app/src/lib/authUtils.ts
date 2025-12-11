import { auth } from "@/config/firebase";
import { AxiosError } from "axios";
import { DateTime } from "luxon";

const MAX_AUTH_AGE_MIN = 5;

export async function needsReauth() {
  const token = await auth.currentUser?.getIdTokenResult()
  if (!token?.authTime) return true;
  const authTime = DateTime.fromISO(token.authTime);
  const timeSinceAuth = authTime.diffNow().as("minutes");

  return timeSinceAuth >= MAX_AUTH_AGE_MIN;
}

export async function reauthRequested(respError: AxiosError) {
  return respError.response?.data === "reauth"
}
