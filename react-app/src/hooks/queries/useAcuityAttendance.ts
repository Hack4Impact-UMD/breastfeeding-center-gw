import { DateTime } from "luxon";
import { useAcuityApptsInRange } from "./useAcuityApptsInRange";

export default function useAcuityAttendance(
  startDate: DateTime,
  endDate: DateTime,
) {
  const {
    data: appts,
    isPending,
    error,
  } = useAcuityApptsInRange(
    startDate.toISO() ?? undefined,
    endDate.toISO() ?? undefined,
  );

  return {
    data: appts?.length,
    isPending,
    error,
  };
}
