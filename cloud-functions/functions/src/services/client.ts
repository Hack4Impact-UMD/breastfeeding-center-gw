import { CollectionReference } from "firebase-admin/firestore";
import { CLIENTS_COLLECTION } from "../types/collections";
import { db } from "./firebase";
import { Client } from "../types/clientType";

export async function getAllExistingClients() {
  const clients: CollectionReference<Client> = db.collection(CLIENTS_COLLECTION);
  return (await clients.get()).docs.map(d => d.data())
}
