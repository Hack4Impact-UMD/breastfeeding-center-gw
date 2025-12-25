import { Baby, Client } from "../../types/clientType";
import { v7 as uuidv7 } from "uuid"
import { getAllExistingClients } from "../client";
import { groupPrimaryClientsByEmail, PrimaryClientEmailMap, SyncResult } from "./utils";
import { getAllAcuityApptsInRange } from "../acuity";
import { AcuityAppointment } from "../../types/acuityType";
import { db } from "../firebase";
import { CLIENTS_COLLECTION } from "../../types/collections";

type AcuityBaby = {
  dob: string
}

type AcuityClient = {
  firstName: string,
  lastName: string,
  email: string,
  babies: AcuityBaby[],
  associatedEmails: Set<string>;
}

export async function syncAcuityClients(startDate: string, endDate: string): Promise<SyncResult> {
  try {
    const allExistingClients = await getAllExistingClients();
    const emailToPrimaryClientMap = groupPrimaryClientsByEmail(allExistingClients);
    const acuityApptsInRange = await getAllAcuityApptsInRange(startDate, endDate);
    const primaryEmails = new Set(allExistingClients.map(c => c.email));

    const acuityClientsByEmail = getAcuityClientsFromAppts(acuityApptsInRange, primaryEmails);

    const { newClients, updatedClients } = mergeAcuityAndExistingClients(acuityClientsByEmail, emailToPrimaryClientMap);

    await Promise.all([writeClients(newClients), writeClients(updatedClients)])

    return {
      status: "OK",
      stats: {
        newClients: newClients.length,
        updatedClients: updatedClients.length
      }
    }
  } catch (err) {
    return {
      status: "ERROR",
      message: (err instanceof Error) ? err.message : "Failed to merge"
    }
  }
}

async function writeClients(clients: Client[]) {
  const CHUNK_SIZE = 500;

  const writes = []
  for (let i = 0; i < clients.length; i += CHUNK_SIZE) {
    const batch = db.batch();
    const chunk = clients.slice(i, i + CHUNK_SIZE);

    chunk.forEach(c => batch.set(db.collection(CLIENTS_COLLECTION).doc(c.id), c))
    writes.push(batch);
  }

  return await Promise.all(writes.map(b => b.commit()))
}


function findPrimaryEmail(emails: string[], primaryEmails: Set<string>) {
  const existingPrim = emails.find(e => primaryEmails.has(e))
  const primary = existingPrim ?? emails[0];
  const secondary = emails.filter(e => e !== primary);

  return { primary, secondary };
}

function getAcuityClientsFromAppts(appts: AcuityAppointment[], primaryEmails: Set<string>) {
  const acuityClientMap = new Map<string, AcuityClient>();

  for (const appt of appts) {
    const emails = appt.email.split(",").map(e => e.trim()).filter(e => e);

    if (emails.length === 0) continue;

    const { primary, secondary } = findPrimaryEmail(emails, primaryEmails);
    primaryEmails.add(primary);

    if (acuityClientMap.has(primary)) {
      const babies = appt.babyDueDatesISO;
      const acuityClient = acuityClientMap.get(primary)!;

      for (const dueDate of babies) {
        if (!acuityClient.babies.some(b => b.dob === dueDate)) {
          acuityClient.babies.push({
            dob: dueDate,
          });
        }
      }

      secondary.forEach(secondaryEmail => acuityClient.associatedEmails.add(secondaryEmail));
    } else {
      acuityClientMap.set(primary, {
        babies: appt.babyDueDatesISO.map(d => ({ dob: d })),
        email: primary,
        firstName: appt.firstName,
        lastName: appt.lastName,
        associatedEmails: new Set(secondary)
      })
    }
  }

  return acuityClientMap;
}

function acuityClientToFullClient(acuityClient: AcuityClient): Client {
  const associated = [...acuityClient.associatedEmails].map(email => acuityClientToFullClient({ firstName: acuityClient.firstName, lastName: acuityClient.lastName, email: email, babies: [], associatedEmails: new Set() }));

  const babies: Baby[] = acuityClient.babies.map((b, index) => ({
    dob: b.dob,
    firstName: "Acuity Baby",
    lastName: `${index + 1}`,
    id: uuidv7(),
  }))

  return {
    associatedClients: associated,
    baby: babies,
    email: acuityClient.email,
    firstName: acuityClient.firstName,
    lastName: acuityClient.lastName,
    id: uuidv7(),
  }
}

// given a list of *potentially* new acuity babies, merge them with the exisiting client's babies
function mergeClientBabies(client: Client, acuityBabies: AcuityBaby[]) {
  const existingBabies = client.baby;
  const merged = [...existingBabies];

  for (const baby of acuityBabies) {
    // a baby with the same id has been found
    if (existingBabies.some(existing => existing.dob === baby.dob)) continue;

    const number = merged.length + 1;

    merged.push({
      firstName: `Baby`,
      middleName: `Acuity`,
      lastName: `${number}`,
      dob: baby.dob,
      id: uuidv7()
    })
  }

  return merged;
}

function mergeAssociatedClients(client: Client, associatedEmails: Set<string>) {
  const existingAssocitedEmails = new Set(client.associatedClients.map(c => c.email));
  const merged: Client[] = [...client.associatedClients]

  for (const email of associatedEmails) {
    if (!existingAssocitedEmails.has(email)) {
      merged.push({
        ...client,
        email,
        id: uuidv7(),
        baby: [],
        associatedClients: []
      })
    }
  }

  return merged;
}

function mergeAcuityAndExistingClients(acuityClientsByEmail: Map<string, AcuityClient>, existingClients: PrimaryClientEmailMap) {
  const newClients: Client[] = [];
  const updatedClients: Client[] = [];

  for (const [email, acuityClient] of acuityClientsByEmail) {
    if (existingClients.has(email)) {
      // an existing client with the same email exists, maybe merge
      const existingClient = existingClients.get(email)!;
      const mergedBabies = mergeClientBabies(existingClient, acuityClient.babies);
      const mergedAssocatedClients = mergeAssociatedClients(existingClient, acuityClient.associatedEmails);

      if (mergedBabies.length !== existingClient.baby.length || mergedAssocatedClients.length !== existingClient.associatedClients.length) {
        updatedClients.push({
          ...existingClient,
          baby: mergedBabies,
          associatedClients: mergedAssocatedClients
        })
      }
    } else {
      newClients.push(acuityClientToFullClient(acuityClient));
    }
  }

  return { newClients, updatedClients }
}
