import { createQueryKeys } from "@lukemorales/query-key-factory";

export const janeQueries = createQueryKeys("janeData", {
  uploadedDataTable: (startDate?: string, endDate?: string) => [
    "uploaded",
    startDate,
    endDate,
  ],
  appts: (startDate?: string, endDate?: string) => [
    "appts",
    startDate,
    endDate,
  ],
  patientId: (patientId: string) => ["patientId", patientId],
});
