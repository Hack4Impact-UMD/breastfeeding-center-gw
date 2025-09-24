export interface Client {
  janeId: string; // Jane patient_number, same as document id
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
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string; // ISO
}
