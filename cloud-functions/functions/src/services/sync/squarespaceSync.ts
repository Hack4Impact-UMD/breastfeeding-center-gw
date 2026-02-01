import { Client } from "../../types/clientType";
import { getAllClients } from "../client";
import { getCustomersByIds, getOrdersInRange, SquarespaceProfile } from "../squarespace";
import { groupPrimaryClientsByEmail, PrimaryClientEmailMap, SyncResult, writeClients } from "./utils";
import { v7 as uuidv7 } from "uuid"

export async function syncSquarespaceClients(
  startDate: string,
  endDate: string
): Promise<SyncResult> {
  try {
    const allExistingClients = await getAllClients();
    const emailToPrimaryClientMap =
      groupPrimaryClientsByEmail(allExistingClients);

    const squarespaceOrders = await getOrdersInRange(startDate, endDate);
    const profiles = await getCustomersByIds(squarespaceOrders.map(o => o.customerId).filter(id => id !== null))

    const { newClients, mergedClients, mergeResult } = mergeSquarespaceProfiles(emailToPrimaryClientMap, profiles);

    const clients = [];
    for (const client of mergeResult.values()) {
      clients.push(client);
    }
    await writeClients(clients)

    return {
      status: "OK",
      stats: {
        newClients: newClients,
        updatedClients: mergedClients
      }
    }
  } catch (err) {
    return {
      status: "ERROR",
      message: err instanceof Error ? err.message : "Failed to merge",
    };
  }
}

export function mergeSquarespaceProfiles(emailToPrimaryClientMap: PrimaryClientEmailMap, profiles: SquarespaceProfile[]): { newClients: number, mergedClients: number, mergeResult: Map<string, Client> } {
  let mergedClients = 0;
  let newClients = 0;
  const mergeResult = new Map<string, Client>();

  for (const profile of profiles) {
    if (profile.email === null) continue; // can't merge without email

    // there's an existing client
    if (emailToPrimaryClientMap.has(profile.email)) {
      const primary = emailToPrimaryClientMap.get(profile.email)!;

      if (profile.email === primary.email) {
        primary.squarespaceCustomerId = profile.id;
      } else { // add to an associated client
        primary.associatedClients = primary.associatedClients.map(ac => {
          if (ac.email === profile.email) {
            return {
              ...ac,
              squarespaceCustomerId: profile.id
            }
          } else {
            return ac;
          }
        })

      }

      // we only want to keep one reference to client by id
      if (!mergeResult.has(primary.id)) {
        mergeResult.set(primary.id, primary);
        mergedClients++;
      }
    } else {
      // we don't have an existing client with this email, create a new one
      const newClient = squarespaceProfileToClient(profile);
      if (newClient) {
        mergeResult.set(newClient.id, newClient);
        newClients++;
      }
    }
  }

  return {
    mergedClients,
    newClients,
    mergeResult
  }
}

function squarespaceProfileToClient(profile: SquarespaceProfile): Client | null {
  if (profile.firstName !== null && profile.lastName !== null && profile.email !== null) {
    return {
      id: uuidv7(),
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      squarespaceCustomerId: profile.id,
      associatedClients: [],
      baby: [],
    }
  } else {
    return null;
  }
}
