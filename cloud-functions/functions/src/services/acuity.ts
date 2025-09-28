import axios from "axios";

const creds = {
  userId: process.env.ACUITY_USER_ID,
  apiKey: process.env.ACUITY_API_KEY,
};

const acuityClient = axios.create({
  baseURL: "https://acuityscheduling.com/api/v1",
  headers: {
    Authorization: `Basic ${creds.userId}:${creds.apiKey}`
  }
})

//TODO: types and processing for this, for now we just fetch and return
export async function getAcuityAppointments(max: number = 10) {
  const res = await acuityClient.get(`/appointments?max=${max}`)
  const data = res.data
  return data
}

//TODO: i don't think this is correct, but i'm just copying it over from the old version for now
export async function getBabyInfo(max: number = 10) {
  const res = await acuityClient.get(`/appointments?max=${max}`)
  const data = res.data
  return data
}

type AcuityAppt = {
  date: Date,
  instructor?: string,
  title?: string,
  classType: string,
  didAttend: boolean,
}

const CLASS_CATEGORIES = [
  "Childbirth Classes",
  "Postpartum Classes",
  "Prenatal Classes",
  "Infant Massage",
  "Parent Groups",
];

export async function getClientAppointments(max: number = 100) {
  const res = await acuityClient.get(`/appointments?max=${max}`)
  const raw = res.data

  const clientMap: Record<string, { appointments: AcuityAppt[] }> = {};

  raw.forEach((appt: { [key: string]: string }) => {
    // Skip anything that isn't one of our class categories
    if (!CLASS_CATEGORIES.includes(appt.category)) return;

    const id = appt.id;
    if (!clientMap[id]) {
      clientMap[id] = { appointments: [] };
    }

    clientMap[id].appointments.push({
      date: new Date(appt.datetime),
      instructor: appt.calendar,
      title: appt.type,
      classType: appt.category,
      didAttend: !appt.canceled,
    });
  })

  return clientMap
}

