import { useQuery } from "@tanstack/react-query";
import { getAllAcuityApptsForClient } from "@/services/acuityService";
import { AcuityAppointment } from "@/types/AcuityType";
import queries from "@/queries";

export function useAcuityApptsForClient(email: string) {
  return useQuery<AcuityAppointment[]>({
    ...queries.acuityData.apptsForClient(email),
    queryFn: async (): Promise<AcuityAppointment[]> => {
      return await getAllAcuityApptsForClient(email);
    },
    enabled: !!email, // Only fetch if email exists
  });
}
