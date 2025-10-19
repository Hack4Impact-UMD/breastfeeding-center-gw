import { Timestamp } from "firebase-admin/firestore"
import { Role } from "./userTypes"

export type UserInvite = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  role: Role,
  createdAt: Timestamp,
  used: boolean
}
