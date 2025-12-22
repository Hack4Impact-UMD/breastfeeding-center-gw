import { useQuery } from "@tanstack/react-query";
import { getAllAcuityApptsForClient } from "@/services/acuityService";
import { AcuityAppointment } from "@/types/AcuityType";
import queries from "@/queries";

export function useAcuityApptsForClients(emails: string[]) {
  return useQuery<AcuityAppointment[]>({
    ...queries.acuityData.apptsForClients(emails),
    queryFn: async (): Promise<AcuityAppointment[]> => {
      const appts = await Promise.all(emails.map(email => getAllAcuityApptsForClient(email)));
      return appts.flatMap(a => a)
    },
    enabled: !!emails && emails.length > 0, // Only fetch if email exists
  });
}
