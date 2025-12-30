import { DateTime } from "luxon";
import { useAcuityApptsInRange } from "./useAcuityApptsInRange";
import { useMemo } from "react";

export default function useMostAttendedAcuityClasses(startDate: DateTime, endDate: DateTime) {
  const { data: appts, isPending, error } = useAcuityApptsInRange(startDate.toISO() ?? undefined, endDate.toISO() ?? undefined);

  const sortedClasses = useMemo(() => {
    if (!appts) return undefined
    const attendanceMap = new Map<string, number>();
    appts.forEach(appt => appt.class && attendanceMap.set(appt.class, (attendanceMap.get(appt.class) ?? 0) + 1))

    const classes = [...attendanceMap.entries()].map(entry => ({
      class: entry[0],
      attendance: entry[1]
    }))

    return classes.sort((a, b) => b.attendance - a.attendance)
  }, [appts])

  return {
    data: sortedClasses,
    isPending,
    error
  }
}
