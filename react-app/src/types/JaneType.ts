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

export type VistType = "HOMEVISIT" | "OFFICE" | "TELEHEALTH";
