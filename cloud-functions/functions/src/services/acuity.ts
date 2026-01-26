import axios from "axios";
import { config } from "../config";
import { DateTime } from "luxon";
import { AcuityAppointment } from "../types/acuityType";
import { logger } from "firebase-functions/v1";

type RawAcuityAppt = {
  id: number;
  forms: {
    id: number;
    values: {
      fieldID: number;
      value: string;
    }[];
  }[];
  firstName: string;
  lastName: string;
  email: string;
  datetime: string;
  calendar: string;
  type: string;
  category: string;
};

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
    const date = DateTime.fromFormat(dateStr, fmt, { zone: "est" });
    if (date.isValid) {
      return date;
    }
  }
  return null;
}

const INTAKE_FORM_ID = 1313857;
const BIRTH_DATE_FIELD_ID = 16417167;
const DUE_DATE_FIELD_ID = 7203871;

function processRawAcuityAppt(appt: RawAcuityAppt) {
  const formValues = appt.forms.find(
    (form) => form.id === INTAKE_FORM_ID,
  )?.values;
  const formats = [
    "LL-dd-yyyy",
    "L-d-yyyy",
    "LL-dd-yy",
    "D",
    "DD",
    "DDD",
    "LL/dd/yyyy",
    "L/d/yyyy",
    "LL/dd/yy",
    "yyyy-dd-LL",
    "yyyy-dd-L",
    "yyyy/dd/LL",
    "yyyy/dd/L",
  ];

  const birthDates = formValues
    ?.find((q) => q.fieldID === BIRTH_DATE_FIELD_ID)
    ?.value?.split(",");
  const dueDates = formValues
    ?.find((q) => q.fieldID === DUE_DATE_FIELD_ID)
    ?.value?.split(",");

  const babyBirthDates =
    birthDates?.map((b) => fromFormatArray(b.trim(), formats)) ?? [];
  const babyDueDates =
    dueDates?.map((b) => fromFormatArray(b.trim(), formats)) ?? [];

  const finalDates: (DateTime<true> | null)[] = [];
  const count = Math.max(babyBirthDates.length, babyDueDates.length);
  for (let i = 0; i < count; i++) {
    const babyBirthDate = babyBirthDates[i] ?? null;
    const babyDueDate = babyDueDates[i] ?? null;
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
    babyDueDatesISO: finalDates
      .filter((d) => d !== null && d !== undefined)
      .map((d) => d.toJSDate().toISOString()),
  } as AcuityAppointment;
}

function processRawAcuityAppts(appts: RawAcuityAppt[]) {
  return appts.map((appt) => processRawAcuityAppt(appt));
}

export async function getAllAcuityApptsInRange(
  startDate: string,
  endDate: string,
  maxInFlight = 10
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

    if (!Array.isArray(response.data))
      throw new Error("Invalid response format!");

    return processRawAcuityAppts(response.data as RawAcuityAppt[]);
  }

  // split into chunks
  let currentStart = startDateLuxon.setZone("utc");
  const requests = []
  while (currentStart < endDateLuxon) {
    const chunkEnd = currentStart.plus({ months: 1 }).setZone("utc");
    const actualChunkEnd =
      chunkEnd > endDateLuxon ? endDateLuxon.setZone("utc") : chunkEnd;

    // make request for this chunk
    requests.push(api.get<RawAcuityAppt[]>("/appointments", {
      params: {
        max: -1,
        minDate: currentStart.toISO(),
        maxDate: actualChunkEnd.toISO(),
      },
    }));

    currentStart = actualChunkEnd.plus({ milliseconds: 1 });
  }

  for (let i = 0; i < requests.length; i += maxInFlight) {
    const chunk = requests.slice(i, i + maxInFlight);

    const resps = await Promise.all(chunk);

    resps.forEach(response => {
      if (!Array.isArray(response.data))
        throw new Error("Invalid response format!");

      acuityApptsInRange = [
        ...acuityApptsInRange,
        ...processRawAcuityAppts(response.data),
      ];
    })
  }


  return acuityApptsInRange;
}

export async function getAllAcuityAppointmentsForClient(
  email: string,
): Promise<AcuityAppointment[]> {
  const client = acuityClient();
  const response = await client.get("/appointments", {
    params: { email, max: -1 },
  });
  return processRawAcuityAppts(response.data as RawAcuityAppt[]);
}

export async function getAcuityApptById(apptId: string) {
  const client = acuityClient();
  const response = await client.get(`/appointments/${apptId}`);

  return processRawAcuityAppt(response.data);
}
