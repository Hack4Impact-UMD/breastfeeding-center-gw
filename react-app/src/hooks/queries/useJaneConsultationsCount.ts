import { DateTime } from "luxon";
import { useJaneAppts } from "./useJaneData";

export function useJaneConsultationsCount(startDate: DateTime, endDate: DateTime) {
  const {
    data: appts,
    isPending,
    error
  } = useJaneAppts(startDate.toISODate() ?? undefined, endDate.toISODate() ?? undefined)

  return {
    data: appts?.length,
    isPending,
    error
  }
}
