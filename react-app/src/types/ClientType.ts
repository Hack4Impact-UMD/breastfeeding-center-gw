export interface Client {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  insurance?: string;
  janeId: string; // Jane patient_number
  paysimpleId?: string; // Paysimple customer id
  baby: Baby[];
}

export interface Baby {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string; // ISO
}
