import { Request, Response, Router } from "express";
import { hasRoles, isAuthenticated } from "../middleware/authMiddleware";
import { db } from "../services/firebase";
import { INVITES_COLLECTION, USERS_COLLECTION } from "../types/collections";
import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { User } from "../types/userTypes";
import { UserInvite } from "../types/inviteType";
import { v7 as uuidv7 } from "uuid"
import { logger } from "firebase-functions";

const router = Router()

// TODO: Currently the figma and ui don't have a role field
// but a role field is necessary to invite different user types.
type UserInviteForm = {
  firstName: string,
  lastName: string,
  email: string
}

// creates and sends a registration invite
router.post("/send", [isAuthenticated, hasRoles(["ADMIN", "DIRECTOR"])], async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email
  } = req.body as UserInviteForm;

  if (!firstName || !lastName || !email) {
    return res.status(400).send("Missing fields!");
  }

  const usersCollection = db.collection(USERS_COLLECTION) as CollectionReference<User>
  const userExists = (await usersCollection.where("email", "==", email).get()).docs.length > 0

  if (userExists) {
    return res.status(400).send("User already exists!");
  }

  const invite: UserInvite = {
    id: uuidv7(),
    sentBy: req.token!.uid,
    createdAt: Timestamp.now(),
    email: email,
    firstName: firstName,
    lastName: lastName,
    role: "VOLUNTEER", // TODO: For now defaults to volunteer
    used: false
  }

  const invitesColleciton = db.collection(INVITES_COLLECTION) as CollectionReference<UserInvite>
  const inviteDoc = invitesColleciton.doc(invite.id)

  await inviteDoc.set(invite)

  //TODO: this link should start with the website url
  const siteURL = process.env.FUNCTIONS_EMULATOR === "true" ? "http://localhost:5173" : "<PROD_URL_HERE>";
  const registerLink = `${siteURL}/register/${invite.id}`

  logger.info(`Invite for user ${firstName} ${lastName} (${email}) created.`)
  logger.info(`Use the following link to register: ${registerLink}`)
  //TODO: send the link by email

  return res.status(200).send("Invite successfully created")
})

export default router;
