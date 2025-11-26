import { useQuery } from "@tanstack/react-query";
import { getAllAcuityApptsInRange } from "@/services/acuityService";
import { AcuityAppointment } from "@/types/AcuityType";
import queries from "@/queries";

export function useAcuityApptsInRange(
  startDate?: string,
  endDate?: string,
  classCategory?: string,
) {
  return useQuery<AcuityAppointment[]>({
    ...queries.acuityData.appts(startDate, endDate, classCategory),
    queryFn: () => getAllAcuityApptsInRange(startDate, endDate, classCategory),
  });
}
