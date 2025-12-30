import { DateTime } from "luxon";
import { useJaneAppts } from "./useJaneData";
import { useMemo } from "react";

export function useNewJaneClientsCount(startDate: DateTime, endDate: DateTime) {
  const {
    data: appts,
    isPending,
    error
  } = useJaneAppts(startDate.toISODate() ?? undefined, endDate.toISODate() ?? undefined)

  const newClients = useMemo(() => appts ? appts?.reduce((count, appt) => appt.firstVisit ? (count + 1) : count, 0) : undefined, [appts])

  return {
    data: newClients,
    isPending,
    error
  }
}
