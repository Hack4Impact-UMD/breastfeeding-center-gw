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
  const startDateLuxon = DateTime.fromISO(startDate);
  const endDateLuxon = DateTime.fromISO(endDate);

  let current = startDateLuxon;
  const dates: DateTime[] = [];

  while (current <= endDateLuxon) {
    dates.push(current);
    current = current.plus({ months: 1 });
  }
  dates.push(endDateLuxon);
  const api = acuityClient();

  let acuityApptsInRange = [];

  for (let i = 0; i < dates.length - 1; i++) {
    // need to verify the type of response this is
    const response = await api.get("/appointments", {
      params: {
        max: -1,
        maxDate: dates[i + 1].toISO(),
        minDate: dates[i].toISO(),
      },
    });
    acuityApptsInRange = [...acuityApptsInRange, ...response];
  }

  return acuityApptsInRange;
}
