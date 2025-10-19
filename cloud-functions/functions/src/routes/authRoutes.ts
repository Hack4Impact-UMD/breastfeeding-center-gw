import { Request, Response, Router } from "express";
import { User } from "../types/userTypes";
import { logger } from "firebase-functions";
import { auth, db } from "../services/firebase";
import { config } from "../config";
import { isInviteValid, UserInvite } from "../types/inviteType";
import { INVITES_COLLECTION, USERS_COLLECTION } from "../types/collections";
import { CollectionReference } from "firebase-admin/firestore";

const router = Router();

type UserRegisterForm = {
  email: string;
  firstName: string;
  lastName: string;
  pronouns?: string;
  phone?: string;
  password: string;
};

/**
  Creates the root user: the initial user with the director role that 
  can invite other users to register.
  
  Valid register request requirements:
  * Secret must match the root user secret defined in the config
  * Email must match the root user email defined in the config
  * Must have all required fields in UserRegisterForm in the body

  Example request:
  ```
  http POST http://127.0.0.1:5001/breastfeeding-center-gw/us-east4/api/auth/register/root/67ce28d3-be0d-46a6-863f-a5fc0169d9b6 email="root@test.com" firstName="Admin" lastName="User" password="password123"
  ```
*/
router.post("/register/root/:secret", async (req: Request, res: Response) => {
  const secret = req.params.secret;

  logger.info("Root user register request received!");

  if (secret !== config.rootUserSecret.value()) {
    logger.warn(
      `Root user register request attempted with bad secret: ${secret}!`,
    );
    return res.status(403).send("Unauthorized");
  }

  const { firstName, lastName, password, email, pronouns, phone } =
    req.body as UserRegisterForm;

  if (!firstName || !lastName || !password || !email) {
    return res.status(400).send("Bad request, missing required fields!");
  }

  if (email !== config.rootUserEmail.value()) {
    logger.warn(
      `Root user register request attempted with unauthorized email: ${email}!`,
    );
    return res.status(403).send("Forbidden");
  }

  // if the root user already exists, return
  if (await auth.getUserByEmail(email).catch(() => undefined)) {
    logger.warn(
      "Root user register request attempted when root user already exists!",
    );
    return res.status(400).send("Root user already exists");
  }

  const authUser = await auth.createUser({
    displayName: `${firstName} ${lastName}`,
    email: email,
    password: password,
    phoneNumber: phone,
  });

  const user = {
    auth_id: authUser.uid,
    email: email,
    firstName: firstName,
    lastName: lastName,
    pronouns: pronouns ?? null,
    phone: phone ?? null,
    type: "DIRECTOR",
  } as User;

  await db.collection(USERS_COLLECTION).doc(user.auth_id).set(user);

  logger.info("Successfully created root user: ", user);

  return res.status(200).send(user);
});

/**
  Register a user from an invite.

  invite_id - the id of the invite to register with, must match credentials
  with the register request

  Request body must have all required fields in UserRegisterForm
*/
router.post(
  "/register/invite/:invite_id",
  async (req: Request, res: Response) => {
    const { inviteId } = req.params;
    logger.info(`Register request received using invite ${inviteId}`);

    const { firstName, lastName, password, email, pronouns, phone } =
      req.body as UserRegisterForm;

    if (!inviteId) {
      return res.status(400).send("No invite ID provided!");
    }

    const invitesCollection = db.collection(
      INVITES_COLLECTION,
    ) as CollectionReference<UserInvite>;
    const inviteDoc = invitesCollection.doc(inviteId);
    const invite: UserInvite = (await inviteDoc.get()).data() as UserInvite;

    if (!invite) {
      logger.warn("Register request attempted without invite!");
      logger.warn(req.body);
      return res.status(404).send("Invite not found or has already been used!");
    }

    if (!isInviteValid(invite, config.inviteExpirationDays.value())) {
      logger.warn("Register request attempted with invalid invite!");
      logger.warn(invite);
      return res.status(403).send("Invite not valid!");
    }

    if (!firstName || !lastName || !password || !email) {
      return res.status(400).send("Bad request, missing required fields!");
    }

    if (email !== invite.email) {
      logger.warn(
        `Attempt to register with an invite using a different email: ${email}. Invite email: ${invite.email}!`,
      );
      return res.status(403).send("Forbidden");
    }

    // if user already exists, return
    if (await auth.getUserByEmail(email).catch(() => undefined)) {
      logger.warn("User register request attempted when user already exists!");
      return res.status(400).send("User already exists");
    }

    const authUser = await auth.createUser({
      displayName: `${firstName} ${lastName}`,
      email: email,
      password: password,
      phoneNumber: phone,
    });

    const user = {
      auth_id: authUser.uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      pronouns: pronouns ?? null,
      phone: phone ?? null,
      type: invite.role,
    } as User;

    const usersCollection = db.collection(
      USERS_COLLECTION,
    ) as CollectionReference<User>;
    await usersCollection.doc(user.auth_id).set(user);

    logger.info(
      `Successfully created user ${user.email} with role ${user.type}`,
    );

    // update the invite to used
    await inviteDoc.update({
      used: true,
    });

    return res.status(200).send(user);
  },
);

export default router;
