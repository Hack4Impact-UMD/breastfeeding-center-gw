// test functions
import { db } from "../config/firebase"; // Import Firestore instance
import { collection, addDoc, getDocs } from "firebase/firestore";

const addUser = async () => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "Sophie",
      email: "sophie@example.com",
      createdAt: new Date(),
    });
    console.log("Document written with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding document:", e);
  }
};



const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
};

export { addUser, fetchUsers };