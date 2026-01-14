import { DateTime } from "luxon";
import { JANE_APPT_COLLECTION } from "../types/collections";
import { db } from "./firebase";
import { logger } from "firebase-functions";
import { JaneAppt } from "../types/janeType";
import { Client } from "../types/clientType";

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

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


/** Does this client have at least one baby born in the last 0–13 weeks? */
export function hasRecentBirth(client: Client, referenceDate: Date): boolean {
  const babies = client.baby ?? [];

  if (!Array.isArray(babies) || babies.length === 0) return false;

  return babies.some((baby) => {
    if (!baby || !baby.dob) return false;

    const dob = new Date(baby.dob as string);
    if (isNaN(dob.getTime())) return false;

    const diffWeeks = (referenceDate.getTime() - dob.getTime()) / MS_PER_WEEK;

    // 4th trimester: 0–13 weeks postpartum
    return diffWeeks >= 0 && diffWeeks <= 13;
  });
}
