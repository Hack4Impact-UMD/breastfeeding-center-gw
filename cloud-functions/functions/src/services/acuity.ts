import axios from "axios";
import { config } from "../config";
import { DateTime } from "luxon";

export const acuityClient = () => {
  const creds = {
    userId: config.acuityUserId.value(),
    apiKey: config.acuityAPIKey.value(),
  };

  return axios.create({
    baseURL: "https://acuityscheduling.com/api/v1",
    headers: {
      Authorization: `Basic ${Buffer.from(`${creds.userId}:${creds.apiKey}`).toString("base64")}`,
    },
  });
};

export async function getAllAcuityApptsInRange(
  startDate: string,
  endDate: string,
) {
  const startDateLuxon = DateTime.fromISO(startDate, { zone: "utc" });
  const endDateLuxon = DateTime.fromISO(endDate, { zone: "utc" });

  if (!startDateLuxon.isValid || !endDateLuxon.isValid) {
    throw new Error("Invalid date format provided");
  }

  const api = acuityClient();
  let acuityApptsInRange: any[] = [];
  const diffInMonths = endDateLuxon.diff(startDateLuxon, "months").months;

  if (diffInMonths <= 1) {
    // make a single request
    const response = await api.get("/appointments", {
      params: {
        max: -1,
        minDate: startDateLuxon.toISO(),
        maxDate: endDateLuxon.toISO(),
      },
    });
    return response.data;
  }

  // split into chunks
  let currentStart = startDateLuxon.setZone("utc");

  while (currentStart < endDateLuxon) {
    const chunkEnd = currentStart.plus({ months: 1 }).setZone("utc");
    const actualChunkEnd = chunkEnd > endDateLuxon ? endDateLuxon.setZone("utc") : chunkEnd;

    // make request for this chunk
    const response = await api.get("/appointments", {
      params: {
        max: -1,
        minDate: currentStart.toISO(),
        maxDate: actualChunkEnd.toISO(),
      },
    });

    acuityApptsInRange = [...acuityApptsInRange, ...response.data];
    currentStart = chunkEnd;
  }

  return acuityApptsInRange;
}
