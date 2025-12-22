import { createQueryKeys } from "@lukemorales/query-key-factory";

export const acuityQueries = createQueryKeys("acuityData", {
  appts: (startDate?: string, endDate?: string, classCategory?: string) => [
    "appts",
    startDate,
    endDate,
    classCategory,
  ],
  apptsForClient: (email: string) => ["appts", "client", email],
  apptsForClients: (emails: string[]) => ["appts", "clients", emails],
});
