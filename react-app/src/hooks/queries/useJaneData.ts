import { useQuery } from "@tanstack/react-query";
import {
  getAllJaneApptsInRange,
  getClientByPatientId,
} from "@/backend/JaneFunctions";
import { JaneAppt, JaneTableRow } from "@/types/JaneType";
import queries from "@/queries";

export function useJaneAppts(startDate?: string, endDate?: string) {
  return useQuery<JaneAppt[]>({
    ...queries.janeData.appts(startDate, endDate),
    queryFn: () => getAllJaneApptsInRange(startDate, endDate)
  })
}

export function useJaneData(startDate?: string, endDate?: string) {
  return useQuery<JaneTableRow[]>({
    ...queries.janeData.uploadedDataTable(startDate, endDate),
    queryFn: async () => {
      const appointments = await getAllJaneApptsInRange(startDate, endDate);

      const janeTableRows = await Promise.all(
        appointments.map(async (appointment) => {
          try {
            const client = await getClientByPatientId(appointment.patientId);
            const tableRow: JaneTableRow = {
              apptId: appointment.apptId,
              patientId: appointment.patientId,
              startAt: appointment.startAt,
              endAt: appointment.endAt,
              visitType: appointment.visitType,
              service: appointment.service,
              clinician: appointment.clinician,
              firstVisit: appointment.firstVisit,
              id: client.id,
              firstName: client.firstName,
              middleName: client.middleName?.slice(0, 1),
              lastName: client.lastName,
              email: client.email,
              dob: client.dob,
              phone: client.phone,
              insurance: client.insurance,
              paysimpleId: client.paysimpleId,
              baby: client.baby,
            };
            return tableRow;
          } catch (error) {
            console.error(
              `Failed to fetch client for patientId ${appointment.patientId}:`,
              error,
            );
            return null;
          }
        }),
      );
      const validRows = janeTableRows.filter((row) => row !== null);
      console.log("TOTAL ROWS: " + validRows.length);
      return validRows;
    },
  });
}
