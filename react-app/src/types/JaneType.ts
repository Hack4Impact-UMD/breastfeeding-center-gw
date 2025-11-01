import { Baby } from "./ClientType";

export interface JaneID extends Jane {
  id: string;
}

export interface Jane {
  apptId: string;
  firstName: string;
  lastName: string;
  email: string;
  visitType: VisitType;
  treatment: string;
  insurance: string;
  date: string; //ISO
  babyDob: string; //ISO
}

export interface JaneAppt {
  apptId: string; // appt_id
  patientId: string; // patient_number
  startAt: string; // start_at ISO
  endAt: string; // end_at ISO
  visitType: VisitType; // treatment_name
  service: string; // treatment_name
  clinician: string; // staff_member
  firstVisit: boolean;
}

// combines fields from both JaneAppt and Client type
export interface JaneTableRow {
  apptId: string; // appt_id
  patientId: string; // patient_number
  startAt: string; // start_at ISO
  endAt: string; // end_at ISO
  visitType: VisitType; // treatment_name
  service: string; // treatment_name
  clinician: string; // staff_member
  firstVisit: boolean;
  id: string; // Jane patient_number, same as document id
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  dob: string; // ISO
  phone?: string;
  insurance?: string;
  paysimpleId?: string; // Paysimple customer id
  baby: Baby[];
}

export type VisitType = "HOMEVISIT" | "OFFICE" | "TELEHEALTH";
