import { Client } from "../../types/clientType";
import { CLIENTS_COLLECTION } from "../../types/collections";
import { db } from "../firebase";
export type PrimaryClientEmailMap = Map<string, Client>;

export type SuccessSyncResult = {
  status: "OK";
  stats: {
    newClients: number;
    updatedClients: number;
  };
};

export type ErrorSyncResult = {
  status: "ERROR";
  message: string;
};

export type SyncResult = SuccessSyncResult | ErrorSyncResult;

// returns a map of email -> primary client
export function groupPrimaryClientsByEmail(
  primaryClients: Client[],
): PrimaryClientEmailMap {
  const clientMap = new Map<string, Client>();

  primaryClients.forEach((primary) => {
    clientMap.set(primary.email, primary);
    primary.associatedClients.forEach((ac) => clientMap.set(ac.email, primary));
  });

  return clientMap;
}

export function findExistingPrimaryClientByEmail(
  emailMap: PrimaryClientEmailMap,
  email: string,
) {
  return emailMap.get(email);
}


export async function writeClients(clients: Client[]) {
  const CHUNK_SIZE = 500;

  for (let i = 0; i < clients.length; i += CHUNK_SIZE) {
    const batch = db.batch();
    const chunk = clients.slice(i, i + CHUNK_SIZE);

    chunk.forEach((c) =>
      batch.set(db.collection(CLIENTS_COLLECTION).doc(c.id), c),
    );
    await batch.commit();
  }
}
