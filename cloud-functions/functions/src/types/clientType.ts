export interface Client {
  id: string; // firestore document id
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  dob: string; // ISO
  phone?: string;
  insurance?: string;
  janeId?: string; // Jane patient_number
  paysimpleId?: string; // Paysimple customer id
  baby: Baby[];
}

export interface Baby {
  id: string; // jane patient_number for the baby
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string; // ISO
}
