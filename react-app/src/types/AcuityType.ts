export interface AcuityAppointment {
    id: number;
    firstName: string; 
    lastName: string;
    email: string;
    instructor: string | null;
    class: string | null; 
    classCategory: string | null; 
    datetime: string;
    babyDueDatesISO: string[];
}