import { createQueryKeys } from "@lukemorales/query-key-factory";

export const acuityQueries = createQueryKeys("acuityData", {
    apptsForClient: (email: string) => ["apptsForClient", email],
});

