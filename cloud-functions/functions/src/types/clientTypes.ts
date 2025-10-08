export interface Client {
  id: string; // Jane patient_number, same as document id
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  insurance?: string;
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
