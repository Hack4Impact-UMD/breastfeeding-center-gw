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

export type VisitType = "HOMEVISIT" | "OFFICE" | "TELEHEALTH";

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
