import { DateTime } from "luxon";
import { useJaneAppts } from "./useJaneData";

export function useJaneConsultationsCount(startDate: DateTime, endDate: DateTime) {
  const {
    data: appts,
    isPending,
    error
  } = useJaneAppts(startDate.toISO() ?? undefined, endDate.toISO() ?? undefined)

  return {
    data: appts?.length,
    isPending,
    error
  }
}
