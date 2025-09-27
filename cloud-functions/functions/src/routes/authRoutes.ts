import { Request, Response, Router } from "express";
import { hasRoles, isAuthenticated } from "../middleware/authMiddleware";
import * as admin from "firebase-admin"
import crypto from "crypto"
import { User } from "../types/userTypes";
import { logger } from "firebase-functions";

const router = Router()

/*
 * Creates a new admin.
 * Takes an object as a parameter that should contain an email, first name, and last name.
 * Arguments: email: string, the user's email
 *            first name: string, the user's first name
 *            last name: string, the user's last name
 */
// only admins can create other admins
router.post("/create/admin", [isAuthenticated, hasRoles(["ADMIN"])], async (req: Request, res: Response) => {
  try {
    const data = req.body

    const auth = admin.auth();
    const db = admin.firestore()

    const pass = crypto.randomBytes(32).toString("hex");
    const userRecord = await auth.createUser({
      email: data.email,
      password: pass,
    })

    await auth.setCustomUserClaims(userRecord.uid, {
      role: "ADMIN",
    })

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
      .get()

    //user does not exist yet
    if (querySnapshot.docs.length == 0) {
      await db
        .collection("Users")
        .add(collectionObject)

      return res.status(200).send("Success");
    } else {
      return res.status(400).send("User already exists");
    }
  } catch (err) {
    logger.error("Create admin user error!")
    logger.error(err)
    return res.status(500).send(err);
  }
})

/**
 * Deletes the user
 * parameter: firebase_id - the user's firebase auth id
 */
router.delete("/delete/:firebase_id", [isAuthenticated, hasRoles(["ADMIN"])], async (req: Request, res: Response) => {
  try {
    const userId = req.params.firebase_id;

    const auth = admin.auth();
    const db = admin.firestore();

    await auth.deleteUser(userId)

    const querySnapshot = await db
      .collection("Users")
      .where("auth_id", "==", userId)
      .get()
    if (querySnapshot.docs.length == 0) {
      return res.status(404).send("User not found!");
    } else {
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        await doc.ref.delete();
      }))
      return res.status(200).send();
    }
  } catch (err) {
    logger.error("Delete user error!")
    logger.error(err)
    return res.status(500).send(err);
  }
})
