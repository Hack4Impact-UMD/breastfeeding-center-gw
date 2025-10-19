import { Timestamp } from "firebase-admin/firestore";
import { Role } from "./userTypes";

export type UserInvite = {
  id: string;
  sentBy: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: Timestamp;
  used: boolean;
};

export function isInviteValid(invite: UserInvite, expireDays: number) {
  if (invite.used) return false;

  const issueTimeSecs = invite.createdAt.seconds;
  const currentTimeSecs = Timestamp.now().seconds;

  const daysSince = (currentTimeSecs - issueTimeSecs) / (60 * 60 * 24);

  return daysSince <= expireDays;
}
