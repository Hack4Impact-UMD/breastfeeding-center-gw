import { Request, Response, Router } from "express";
import { hasRoles, isAuthenticated } from "../middleware/authMiddleware";
import { auth, db } from "../services/firebase";
import { USERS_COLLECTION } from "../types/collections";
import { Role, RoleLevels, User } from "../types/userType";
import { logger } from "firebase-functions";
import { CollectionReference } from "firebase-admin/firestore";

const router = Router();

// returns a list of all registered users
router.get("/all", [isAuthenticated], async (_: Request, res: Response) => {
  const usersCollection = db.collection(USERS_COLLECTION);
  const users = (await usersCollection.get()).docs.map(
    (user) => user.data() as User,
  );

  return res.status(200).send(users);
});

router.get(
  "/id/:auth_id",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const id = req.params.auth_id;

    const usersCollection = db.collection(USERS_COLLECTION);
    const docRef = usersCollection.doc(id);
    const user = await docRef.get();

    if (!user.exists) return res.status(404).send("User does not exist!");

    return res.status(200).send(user.data() as User);
  },
);

// deletes user with the specified auth_id
// TODO: The restrictions in this function need to be double checked.
router.delete(
  "/id/:auth_id",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const userId = req.params.auth_id;
    const currentUserRole = (await auth.getUser(req.token!.uid)).customClaims
      ?.role as Role;
    if (!userId) return res.status(400).send("Missing id");

    const userDoc = db.collection(USERS_COLLECTION).doc(userId);
    const user = (await userDoc.get()).data() as User;

    if (!user) {
      return res.status(404).send("User does not exist");
    }

    if (user.type === "DIRECTOR") {
      const usersCollection = db.collection(USERS_COLLECTION);
      const directorUsers = await usersCollection
        .where("type", "==", "DIRECTOR")
        .get();
      if (directorUsers.size <= 1) {
        return res
          .status(400)
          .send(
            "There must be one active user with the DIRECTOR role at all times!",
          );
      }
    }

    if (
      currentUserRole !== "DIRECTOR" &&
      req.token?.uid !== userId &&
      RoleLevels[user.type] >= RoleLevels[currentUserRole]
    ) {
      return res.status(403).send("Insufficient permissions to delete user!");
    }

    await auth.deleteUser(userId);
    await userDoc.delete();

    logger.info(`User with ID ${userId} deleted`);
    return res.status(200).send();
  },
);

// update the current user's name and pronouns
router.put(
  "/me/namepronouns",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const { firstName, lastName, pronouns } = req.body as {
      firstName: string;
      lastName: string;
      pronouns: string;
    };

    if (!firstName || !lastName) return res.status(400).send("Missing fields!");

    const userId = req.token!.uid;

    const usersCollection = db.collection(
      USERS_COLLECTION,
    ) as CollectionReference<User>;
    const userDoc = usersCollection.doc(userId);

    await userDoc.update({
      firstName: firstName,
      lastName: lastName,
      pronouns: pronouns ?? null,
    });

    return res.status(200).send("Name and pronouns successfully updated!");
  },
);

// update the current user's email
router.put(
  "/me/email",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const { oldEmail, newEmail } = req.body as {
      oldEmail: string;
      newEmail: string;
    };

    if (!oldEmail || !newEmail) return res.status(400).send("Missing fields!");

    const userEmail = req.token!.email;
    const userId = req.token!.uid;

    if (userEmail !== oldEmail) {
      logger.warn("Attempt to update email using mismatched old email!");
      logger.warn(`old email: ${oldEmail}, user email: ${userEmail}`);
      return res.status(401).send("Unauthorized email!");
    }

    const usersCollection = db.collection(
      USERS_COLLECTION,
    ) as CollectionReference<User>;
    const userDoc = usersCollection.doc(userId);

    await userDoc.update({
      email: newEmail,
    });

    await auth.updateUser(userId, {
      email: newEmail,
    });

    return res.status(200).send("Email successfully updated!");
  },
);

// update the role of the user with the specified id, subject to restrictions
router.put(
  "/id/:id/role",
  [isAuthenticated, hasRoles(["ADMIN", "DIRECTOR"])],
  async (req: Request, res: Response) => {
    const authId = req.params.id;
    const { role: newRole } = req.body as { role: Role };
    const currentUserRole = (await auth.getUser(req.token!.uid)).customClaims
      ?.role as Role;

    if (!currentUserRole) {
      return res.status(400).send("User does not have a role!");
    }

    if (!newRole) return res.status(400).send("Missing role!");

    const usersCollection = db.collection(
      USERS_COLLECTION,
    ) as CollectionReference<User>;
    const userDoc = usersCollection.doc(authId);

    // the user whose role will be updated
    const userToUpdate = (await userDoc.get()).data() as User;

    if (
      !userToUpdate ||
      (currentUserRole !== "DIRECTOR" &&
        userToUpdate.auth_id !== req.token?.uid &&
        RoleLevels[userToUpdate.type] >= RoleLevels[currentUserRole])
    ) {
      return res.status(403).send("Cannot update user's role!");
    }

    // trying to give a user a role that is higher than the current user's role
    if (RoleLevels[newRole] > RoleLevels[currentUserRole]) {
      return res.status(403).send("Forbidden");
    }

    if (userToUpdate.type === "DIRECTOR" && newRole !== "DIRECTOR") {
      const directorUsers = await usersCollection
        .where("type", "==", "DIRECTOR")
        .get();
      if (directorUsers.size <= 1) {
        return res.status(400).send("There must always be one DIRECTOR user");
      }
    }

    await userDoc.update({
      type: newRole,
    });

    await auth.setCustomUserClaims(authId, { role: newRole });

    return res.status(200).send("Role updated successfully");
  },
);

export default router;
