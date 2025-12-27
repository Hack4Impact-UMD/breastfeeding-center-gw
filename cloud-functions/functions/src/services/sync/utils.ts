import { Client } from "../../types/clientType";
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
