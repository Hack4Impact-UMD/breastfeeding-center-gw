import { DateTime } from "luxon";
import { JANE_APPT_COLLECTION } from "../types/collections";
import { db } from "./firebase";
import { logger } from "firebase-functions";
import { JaneAppt } from "../types/janeType";

export async function getAllJaneApptsInRange(
  startDate?: string,
  endDate?: string,
) {
  // Start query from JaneAppts collection
  const collectionRef = db.collection(JANE_APPT_COLLECTION);
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    collectionRef;

  // Filter appointments by date range if provided
  if (startDate) {
    const start = DateTime.fromISO(startDate).startOf("day");
    if (!start.isValid) {
      throw new Error("Invalid start date format");
    }
    query = query.where("startAt", ">=", start.toISO());
  }

  if (endDate) {
    const end = DateTime.fromISO(endDate).endOf("day");
    logger.info("end time: " + end);
    if (!end.isValid) {
      throw new Error("Invalid end date format");
    }
    query = query.where("startAt", "<=", end.toISO());
  }

  // Execute query to get appointments within timeframe
  const snapshot = await query.get();

  return snapshot.docs.map((d) => d.data() as JaneAppt);
}
