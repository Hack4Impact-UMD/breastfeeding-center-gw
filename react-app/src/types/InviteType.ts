import { Timestamp } from "firebase/firestore";
import { Role } from "./UserType";

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
