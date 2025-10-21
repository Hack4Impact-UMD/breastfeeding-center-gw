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
