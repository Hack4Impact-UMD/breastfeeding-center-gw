import { Request, Response, Router } from "express";
import { hasRoles, isAuthenticated } from "../middleware/authMiddleware";
import { auth, db } from "../services/firebase";
import { USERS_COLLECTION } from "../types/collections";
import { Role, User } from "../types/userTypes";
import { logger } from "firebase-functions";
import { CollectionReference } from "firebase-admin/firestore";

const roleLevel: Record<Role, number> = {
  VOLUNTEER: 0,
  ADMIN: 1,
  DIRECTOR: 2,
};

const router = Router();

// returns a list of all registered users
router.get("/all", [isAuthenticated], async (_: Request, res: Response) => {
  const usersCollection = db.collection(USERS_COLLECTION);
  const users = (await usersCollection.get()).docs.map(
    (user) => user.data() as User,
  );

  return res.status(200).send(users);
});

// deletes user with the specified auth_id
// TODO: The restrictions in this function need to be double checked.
// TODO: Implement a check to ensure there is always 1 director after deletion.
router.delete(
  "/id/:auth_id",
  [isAuthenticated, hasRoles(["DIRECTOR", "ADMIN"])],
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

    if (roleLevel[user.type] >= roleLevel[currentUserRole]) {
      return res.status(403).send("Insufficient permissions to delete user!");
    }

    await userDoc.delete();
    await auth.deleteUser(userId);

    logger.info(`User with ID ${userId} deleted`);
    return res.status(200).send();
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
      roleLevel[userToUpdate.type] >= roleLevel[currentUserRole]
    ) {
      return res.status(403).send("Cannot update user's role!");
    }

    // trying to give a user a role that is higher than the current user's role
    if (roleLevel[newRole] > roleLevel[currentUserRole]) {
      return res.status(403).send("Forbidden");
    }

    await userDoc.update({
      type: newRole,
    });

    await auth.setCustomUserClaims(authId, { role: newRole });

    return res.status(200).send("Role updated successfully");
  },
);

export default router;
