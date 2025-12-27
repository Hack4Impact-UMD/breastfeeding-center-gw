import { CollectionReference } from "firebase-admin/firestore";
import { CLIENTS_COLLECTION } from "../types/collections";
import { db } from "./firebase";
import { Client } from "../types/clientType";

export async function getAllClients() {
  const clients = db.collection(
    CLIENTS_COLLECTION,
  ) as CollectionReference<Client>;
  return (await clients.get()).docs.map((d) => d.data());
}
