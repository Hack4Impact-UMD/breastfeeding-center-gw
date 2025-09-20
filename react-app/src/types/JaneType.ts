export interface JaneID extends Jane {
  id: string;
}

export interface Jane {
  apptId: string;
  firstName: string;
  lastName: string;
  email: string;
  visitType: VistType;
  treatment: string;
  insurance: string;
  date: string; //ISO
  babyDob: string; //ISO
}

export interface JaneAppt {
  patientId: string; // patient_number
  apptId: string; // appt_id
  start_at: string; // ISO
  end_at: string; // ISO
  visitType: VistType;
  service: string;
  staffMember: string;
  firstVisit: boolean;
}

export type VistType = "HOMEVISIT" | "OFFICE" | "TELEHEALTH";
