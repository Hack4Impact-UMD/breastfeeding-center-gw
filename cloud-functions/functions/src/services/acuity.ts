import axios from "axios";
import { config } from "../config";
import { DateTime } from "luxon";
import { AcuityAppointment } from "../types/acuityType";

type RawAcuityAppt = {
  id: number,
  forms: {
    id: number,
    values: {
      fieldID: number,
      value: string
    }[]
  }[],
  firstName: string,
  lastName: string,
  email: string,
  datetime: string,
  calendar: string,
  type: string,
  category: string
}

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

function fromFormatArray(dateStr: string | undefined, formats: string[]) {
  if (!dateStr) return null;

  for (const fmt of formats) {
    const date = DateTime.fromFormat(dateStr, fmt)
    if (date.isValid) {
      return date;
    }
  }
  return null;
}

function processRawAcuityAppts(appts: RawAcuityAppt[]) {
  return appts.map(appt => {
    const formValues = appt.forms.find((form) => form.id === 1313857)?.values;
    const formats = ["LL-dd-yyyy", "L-d-yyyy", "LL-dd-yy", "D", "DD", "DDD", "LL/dd/yyyy", "L/d/yyyy", "LL/dd/yy", "yyyy-dd-LL", "yyyy-dd-L", "yyyy/dd/LL", "yyyy/dd/L"];

    const birthDates = (formValues?.find(q => q.fieldID === 16417167)?.value)?.split(",");
    const dueDates = (formValues?.find(q => q.fieldID === 7203871)?.value)?.split(",");

    const babyBirthDates = birthDates?.map(b => fromFormatArray(b, formats))?.sort() ?? [];
    const babyDueDates = dueDates?.map(b => fromFormatArray(b, formats))?.sort() ?? [];

    const finalDates = []
    for (let i = 0; i < Math.min(babyBirthDates.length, babyDueDates.length); i++) {
      const babyBirthDate = babyBirthDates[i];
      const babyDueDate = babyDueDates[i];
      const finalBirthDate = babyBirthDate !== null ? babyBirthDate : babyDueDate;
      finalDates.push(finalBirthDate);
    }

    return {
      id: appt.id,
      firstName: appt.firstName,
      lastName: appt.lastName,
      email: appt.email,
      datetime: appt.datetime,
      instructor: appt.calendar,
      class: appt.type,
      classCategory: appt.category,
      babyDueDatesISO: finalDates.map(d => d?.toISODate()).filter(d => d !== null && d !== undefined)
    } as AcuityAppointment
  }
  )
}

export async function getAllAcuityApptsInRange(
  startDate: string,
  endDate: string,
): Promise<AcuityAppointment[]> {
  const startDateLuxon = DateTime.fromISO(startDate, { zone: "utc" });
  const endDateLuxon = DateTime.fromISO(endDate, { zone: "utc" });

  if (!startDateLuxon.isValid || !endDateLuxon.isValid) {
    throw new Error("Invalid date format provided");
  }

  const api = acuityClient();
  let acuityApptsInRange: AcuityAppointment[] = [];
  const diffInMonths = endDateLuxon.diff(startDateLuxon, "months").months;

  if (startDateLuxon.toMillis() > endDateLuxon.toMillis()) {
    throw new Error("startDate must be on or before endDate");
  }

  if (diffInMonths <= 1) {
    // make a single request
    const response = await api.get("/appointments", {
      params: {
        max: -1,
        minDate: startDateLuxon.toISO(),
        maxDate: endDateLuxon.toISO(),
      },
    });

    if (!Array.isArray(response.data)) throw new Error("Invalid resposne format!")

    return processRawAcuityAppts(response.data as RawAcuityAppt[])
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

    acuityApptsInRange = [...acuityApptsInRange, ...processRawAcuityAppts(response.data)];
    currentStart = actualChunkEnd.plus({ milliseconds: 1 });
  }

  return acuityApptsInRange;
}
