export interface Client {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  insurance?: string;
  jane_id: string; // Jane patient_number
  paysimple_id?: string; // Paysimple customer id
  baby: Baby[];
}

export interface Baby {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string; // ISO
}
