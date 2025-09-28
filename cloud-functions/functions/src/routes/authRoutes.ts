import { Request, Response, Router } from "express";
import { hasRoles, isAuthenticated } from "../middleware/authMiddleware";
import crypto from "crypto";
import { Role, User } from "../types/userTypes";
import { logger } from "firebase-functions";
import { auth, db } from "../services/firebase";

const router = Router();

/*
 * Creates a new admin.
 * Takes an object as a parameter that should contain an email, first name, and last name.
 * Arguments: email: string, the user's email
 *            first name: string, the user's first name
 *            last name: string, the user's last name
 */
// only admins can create other admins
router.post(
  "/create/admin",
  [isAuthenticated, hasRoles(["ADMIN"])],
  async (req: Request, res: Response) => {
    try {
      const data = req.body;

      const pass = crypto.randomBytes(32).toString("hex");
      const userRecord = await auth.createUser({
        email: data.email,
        password: pass,
      });

      await auth.setCustomUserClaims(userRecord.uid, {
        role: "ADMIN",
      });

      const collectionObject: User = {
        auth_id: userRecord.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        type: "ADMIN",
      };

      const querySnapshot = await db
        .collection("Users")
        .where("auth_id", "==", userRecord.uid)
        .get();

      //user does not exist yet
      if (querySnapshot.docs.length == 0) {
        await db.collection("Users").add(collectionObject);

        return res.status(200).send("Success");
      } else {
        return res.status(400).send("User already exists");
      }
    } catch (err) {
      logger.error("Create admin user error!");
      logger.error(err);
      return res.status(500).send(err);
    }
  },
);

/**
 * Deletes the user
 * parameter: firebase_id - the user's firebase auth id
 */
router.delete(
  "/user/:firebase_id",
  [isAuthenticated, hasRoles(["ADMIN"])],
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.firebase_id;

      await auth.deleteUser(userId);

      const querySnapshot = await db
        .collection("Users")
        .where("auth_id", "==", userId)
        .get();
      if (querySnapshot.docs.length == 0) {
        return res.status(404).send("User not found!");
      } else {
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            await doc.ref.delete();
          }),
        );
        return res.status(200).send();
      }
    } catch (err) {
      logger.error("Delete user error!");
      logger.error(err);
      return res.status(500).send(err);
    }
  },
);

/**
 * Updates the current user's email
 * Arguments: email - the user's current email
 *            newEmail - the user's new email
 */
router.post(
  "/me/email",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const { email, newEmail } = req.body as {
        email: string;
        newEmail: string;
      };

      if (!email || !newEmail || req.token?.email !== email)
        return res.status(400).send("Invalid request!");

      await auth.updateUser(req.token.uid, {
        email: newEmail,
      });

      const querySnapshot = await db
        .collection("Users")
        .where("auth_id", "==", req.token.uid)
        .get();

      if (querySnapshot.docs.length == 0) {
        return res.status(404).send("Failed to find user");
      } else {
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            await doc.ref.update({ email: newEmail });
          }),
        );
        return res.status(200).send("Success");
      }
    } catch (err) {
      logger.error("Update email error!");
      logger.error(err);
      return res.status(500).send(err);
    }
  },
);

/*
 * Changes a user's role in both authorization and the database.
 * Takes an object as a parameter that should contain a firebase_id field and a role field.
 * This function can only be called by a user with admin status
 * Arguments: firebase_id - the id of the user
 *            role: the user's new role; string, (Options: "ADMIN", "TEACHER")
 */
router.post(
  "/user/:firebase_id/role",
  [isAuthenticated, hasRoles(["ADMIN"])],
  async (req: Request, res: Response) => {
    try {
      const authId = req.params.firebase_id;
      const { role } = req.body as { role: Role };

      if (!role) return res.status(400).send("Missing role!");

      await auth.setCustomUserClaims(authId, { role: role });
      const querySnapshot = await db
        .collection("Users")
        .where("auth_id", "==", authId)
        .get();
      if (querySnapshot.docs.length == 0) {
        return res.status(404).send("User not found!");
      } else {
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            await doc.ref.update({ type: role });
          }),
        );
        return res.status(200).send();
      }
    } catch (err) {
      logger.error("Update role error!");
      logger.error(err);
      return res.status(500).send(err);
    }
  },
);

export default router;
