import { Request, Router, Response } from "express";
import { logger } from "firebase-functions";
import { Client, Baby } from "../types/clientTypes";
import { db } from "../services/firebase";
import { isAuthenticated } from "../middleware/authMiddleware";
import { DateTime } from "luxon";

const router = Router();

router.get(
  "/appointments",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate
        ? DateTime.fromISO(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate;

      // get all appts from collection
      const snapshot = await db.collection("JaneAppt").get();
      console.log("Found docs:", snapshot.size);

      snapshot.forEach((doc) => console.log(doc.id, doc.data()));
      // const appts: JaneAppt[] = snapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // })) as JaneAppt[];

      // if (startDate) {
      //   // filter for startDates >= the start date provided
      //   let filtered = await appts.where("startAt", ">=", startDate).get();
      // }
      return res.status(200).send([]);
    } catch (e) {
      return res.status(400).send((e as Error).message);
    }
  },
);

export default router;
