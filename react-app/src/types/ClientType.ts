export interface Client {
  id: string;
  janeId?: string; // Jane patient_number
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  dob: string; // ISO
  phone?: string;
  insurance?: string;
  paysimpleId?: string; // Paysimple customer id
  baby: Baby[];
  associatedClients: Client[];
}

export interface Baby {
  id: string; // jane patient_number for the baby
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string; // ISO
}
