import { createQueryKeys } from "@lukemorales/query-key-factory";

export const janeQueries = createQueryKeys("janeData", {
  uploadedDataTable: (startDate?: string, endDate?: string) => [
    "uploaded",
    startDate,
    endDate,
  ],
  appts: (startDate?: string, endDate?: string, clientId?: string) => [
    "appts",
    startDate,
    endDate,
    clientId,
  ],
  retention: (startDate?: Date, endDate?: Date, recentChildbirth: boolean = false) => [
    "retention",
    startDate,
    endDate,
    recentChildbirth
  ]
});
