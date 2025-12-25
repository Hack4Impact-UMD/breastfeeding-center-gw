import { Client } from "../../types/clientType";
import { v7 as uuidv7 } from "uuid"

type AcuityBaby = {
  dob: string
}

export async function syncAcuityClients() {

}

// given a list of *potentially* new acuity babies, merge them with the exisiting client's babies
export function mergeClientBabies(client: Client, acuityBabies: AcuityBaby[]) {
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
}
