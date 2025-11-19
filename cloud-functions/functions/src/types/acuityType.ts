export interface AcuityAppointment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  calendar: string | null;
  type: string | null;
  category: string | null;
  datetime: string; // ISO format
  canceled: boolean;
}

