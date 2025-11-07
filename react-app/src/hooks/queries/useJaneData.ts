import { useQuery } from "@tanstack/react-query";
import {
  getAllJaneApptsInRange,
  getAllJaneApptsInRangeWithClient,
} from "@/services/janeService";
import { JaneAppt, JaneTableRow } from "@/types/JaneType";
import queries from "@/queries";

export function useJaneAppts(startDate?: string, endDate?: string) {
  return useQuery<JaneAppt[]>({
    ...queries.janeData.appts(startDate, endDate),
    queryFn: () => getAllJaneApptsInRange(startDate, endDate),
  });
}

export function useJaneData(startDate?: string, endDate?: string) {
  return useQuery<JaneTableRow[]>({
    ...queries.janeData.uploadedDataTable(startDate, endDate),
    queryFn: async () => {
      const appointments = await getAllJaneApptsInRangeWithClient(
        startDate,
        endDate,
      );

      const janeTableRows = appointments.map((appointment) => {
        const client = appointment.client;
        const tableRow: JaneTableRow = {
          apptId: appointment.apptId,
          patientId: appointment.patientId,
          startAt: appointment.startAt,
          endAt: appointment.endAt,
          visitType: appointment.visitType,
          service: appointment.service,
          clinician: appointment.clinician,
          firstVisit: appointment.firstVisit,
          id: client?.janeId || "N/A",
          firstName: client?.firstName ?? "N/A",
          middleName: client?.middleName?.slice(0, 1),
          lastName: client?.lastName ?? "N/A",
          email: client?.email ?? "N/A",
          dob: client?.dob ?? "N/A",
          phone: client?.phone ?? "N/A",
          insurance: client?.insurance ?? "N/A",
          paysimpleId: client?.paysimpleId ?? "N/A",
          baby: client?.baby ?? [],
        };

        return tableRow;
      });
      const validRows = janeTableRows.filter((row) => row !== null);
      console.log("TOTAL ROWS: " + validRows.length);
      return validRows;
    },
  });
}
