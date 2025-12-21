import { Client } from "@/types/ClientType";

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

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
