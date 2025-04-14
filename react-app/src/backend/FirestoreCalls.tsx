// firestore calls
import { collection, getDocs, query, where, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase"; 
import { Jane, JaneID } from "../types/JaneType";

export const addJaneSpreadsheet = async (janeList: Jane[]) => {
    const janeCollection = collection(db, "Jane");

    for (const entry of janeList) {
        // Check for existing doc with same apptId
        const q = query(janeCollection, where("apptId", "==", entry.apptId));
        const existing = await getDocs(q);

        if (!existing.empty) {
            console.log(`Skipping duplicate: apptId ${entry.apptId}`);
            continue;
        }

        await addDoc(janeCollection, entry);
        console.log(`Added appointment: ${entry.apptId}`);
    }
};

export const getAllJaneData = async (): Promise<JaneID[]> => {
    const janeCollection = collection(db, "Jane");
    const snapshot = await getDocs(janeCollection);

    const janeList: JaneID[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as JaneID[];

    return janeList;
};

export const deleteJaneById = async (id: string): Promise<void> => {
    const janeDocRef = doc(db, "Jane", id);
    await deleteDoc(janeDocRef);
};

