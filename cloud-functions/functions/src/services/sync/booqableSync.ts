import { logger } from "firebase-functions/v1";
import { Client } from "../../types/clientType";
import { getAllClients } from "../client";
import { groupPrimaryClientsByEmail, PrimaryClientEmailMap, SyncResult, writeClients } from "./utils";
import { v7 as uuidv7 } from "uuid"
import { getBooqableRentalsInRange } from "../stripe";
import { DateTime } from "luxon";

type BooqableProfile = {
  email?: string,
  name?: string,
  stripeId: string
}

export async function syncBooqableClients(
  startDate: string,
  endDate: string
): Promise<SyncResult> {
  try {
    const allExistingClients = await getAllClients();
    const emailToPrimaryClientMap =
      groupPrimaryClientsByEmail(allExistingClients);

    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);

    if (!start.isValid || !end.isValid) {
      return { status: "ERROR", message: "Invalid date range provided" };
    }

    const rentals = await getBooqableRentalsInRange(start, end);

    const profileMap: Map<string, BooqableProfile> = new Map(rentals.map(r => [r.customerId, {
      email: r.customerEmail,
      name: r.customerName,
      stripeId: r.customerId
    }]));

    const profiles: BooqableProfile[] = Array.from(profileMap.values());

    const { newClients, mergedClients, mergeResult } = mergeBooqableProfiles(emailToPrimaryClientMap, profiles);

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
    logger.error("Booqable sync failed:")
    logger.error(err);
    return {
      status: "ERROR",
      message: err instanceof Error ? err.message : "Failed to merge",
    };
  }
}

export function mergeBooqableProfiles(emailToPrimaryClientMap: PrimaryClientEmailMap, profiles: BooqableProfile[]): { newClients: number, mergedClients: number, mergeResult: Map<string, Client> } {
  let mergedClients = 0;
  let newClients = 0;
  const mergeResult = new Map<string, Client>();

  for (const profile of profiles) {
    if (!profile.email) continue; // can't merge without email
    if (!profile.name) continue;

    // there's an existing client
    if (emailToPrimaryClientMap.has(profile.email)) {
      const primary = emailToPrimaryClientMap.get(profile.email)!;

      if (profile.email === primary.email) {
        primary.stripeId = profile.stripeId;
      } else { // add to an associated client
        primary.associatedClients = primary.associatedClients.map(ac => {
          if (ac.email === profile.email) {
            return {
              ...ac,
              stripeId: profile.stripeId
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
      const newClient = booqableProfileToClient(profile);
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

function booqableProfileToClient(profile: BooqableProfile): Client | null {
  if (profile.name && profile.email) {
    const parts = profile.name.split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") ?? "";

    return {
      id: uuidv7(),
      firstName,
      lastName,
      email: profile.email,
      stripeId: profile.stripeId,
      associatedClients: [],
      baby: [],
    }
  } else {
    return null;
  }
}
