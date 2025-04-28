// firestore calls
import { collection, getDocs, query, where, addDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase"; 
import { Jane, JaneID } from "../types/JaneType";

export const addJaneSpreadsheet = async (janeList: Jane[]) => {
    const janeCollection = collection(db, "Jane");
    let uploadsAttempted = 0;
    let uploadsSkipped = 0;
  
    const uploadPromises = janeList.map(async (entry) => {
        const q = query(janeCollection, where("apptId", "==", entry.apptId));
        const existing = await getDocs(q);
  
        if (!existing.empty) {
            console.log(`Skipping duplicate: apptId ${entry.apptId}`);
            uploadsSkipped++;
            return; // Skip duplicate
        }
  
        await addDoc(janeCollection, entry);
        console.log(`Added appointment: ${entry.apptId}`);
        uploadsAttempted++;
    });
  
    await Promise.all(uploadPromises);
    console.log(`Upload Summary: Attempted: ${uploadsAttempted}, Skipped: ${uploadsSkipped}`);
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

export const deleteJaneByIds = async (idList: string[]): Promise<void> => {
    const deletePromises = idList.map(async (entry) => {
        const janeDocRef = doc(db, "Jane", entry);
        await deleteDoc(janeDocRef);
    });
    
    await Promise.all(deletePromises);
};