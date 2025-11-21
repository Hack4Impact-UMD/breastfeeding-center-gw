export interface AcuityAppointment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  instructor: string | null; // calendar field 
  class: string | null; // type field
  classCategory: string | null; // category field
  datetime: string; // ISO format
  // canceled: boolean;
  babyDueDatesISO: string[]
}

