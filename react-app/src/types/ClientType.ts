export interface Client {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  insurance?: string;
  jane_patient_id: string; // Jane patient_number
  baby: Baby[];
}

export interface Baby {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string; // ISO
}
