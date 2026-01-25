import { Request, Response, Router } from "express";
import { hasRoles, isAuthenticated } from "../middleware/authMiddleware";
import { auth, db } from "../services/firebase";
import { INVITES_COLLECTION, USERS_COLLECTION } from "../types/collections";
import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { Role, RoleLevels, User } from "../types/userType";
import { isInviteValid, UserInvite } from "../types/inviteType";
import { v7 as uuidv7 } from "uuid";
import { logger } from "firebase-functions";
import { config } from "../config";
import { inviteTemplate, sendTestEmail } from "../services/email";

const router = Router();

type UserInviteForm = {
  firstName: string;
  lastName: string;
  email: string;
  role?: Role;
};

// creates and sends a registration invite
router.post(
  "/send",
  [isAuthenticated, hasRoles(["ADMIN", "DIRECTOR"])],
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, role } = req.body as UserInviteForm;

    const currentUserRole = (await auth.getUser(req.token!.uid)).customClaims
      ?.role as Role;

    if (RoleLevels[role ?? "VOLUNTEER"] > RoleLevels[currentUserRole]) {
      // can't invite someone with a higher role
      return res.status(403).send("Forbidden");
    }

    if (!firstName || !lastName || !email) {
      return res.status(400).send("Missing fields!");
    }

    const usersCollection = db.collection(
      USERS_COLLECTION,
    ) as CollectionReference<User>;
    const userExists =
      (await usersCollection.where("email", "==", email).get()).docs.length > 0;

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
      role: role ?? "VOLUNTEER",
      used: false,
    };

    const invitesColleciton = db.collection(
      INVITES_COLLECTION,
    ) as CollectionReference<UserInvite>;
    const inviteDoc = invitesColleciton.doc(invite.id);

    await inviteDoc.set(invite);

    //TODO: this link should start with the website url
    const siteURL =
      process.env.FUNCTIONS_EMULATOR === "true"
        ? "http://localhost:5173"
        : "<PROD_URL_HERE>";
    const registerLink = `${siteURL}/register/${invite.id}`;

    await sendTestEmail("bcgw.dashboard@gmail.com", invite.email, "BCGW Dashboard Invite", inviteTemplate(invite));

    logger.info(`Invite for user ${firstName} ${lastName} (${email}) created.`);
    logger.info(`Use the following link to register: ${registerLink}`);
    //TODO: send the link by email

    return res.status(200).send("Invite successfully created");
  },
);

router.get("/id/:inviteId", async (req: Request, res: Response) => {
  const inviteId = req.params.inviteId;
  logger.info(`Fetching invite ${inviteId}`);

  const invitesCollection = db.collection(INVITES_COLLECTION);
  const docRef = invitesCollection.doc(inviteId);
  const inviteDoc = await docRef.get();

  if (!inviteDoc.exists) {
    return res.status(404).send("Invite not found!");
  }

  const invite = inviteDoc.data() as UserInvite;
  const expire = config.inviteExpirationDays.value();

  return res.json({
    ...invite,
    valid: isInviteValid(invite, expire),
  });
});

export default router;
