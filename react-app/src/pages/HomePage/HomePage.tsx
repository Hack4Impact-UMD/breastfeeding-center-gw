import HomeStatsCarousel from "@/components/HomeStats/HomeStatsCarousel";
import useAcuityAttendance from "@/hooks/queries/useAcuityAttendance";
import { useJaneConsultationsCount } from "@/hooks/queries/useJaneConsultationsCount";
import useMostAttendedAcuityClasses from "@/hooks/queries/useMostAttendedAcuityClasses";
import { useNewJaneClientsCount } from "@/hooks/queries/useNewJaneClientsCount";
import { DateTime } from "luxon";
import { useMemo } from "react";

export default function HomePage() {
  const startDate = useMemo(() => DateTime.now().minus({ month: 1 }), []);
  const endDate = useMemo(() => DateTime.now(), []);
  const {
    data: newClients,
    isPending: clientCountPending,
    error: clientCountError,
  } = useNewJaneClientsCount(startDate, endDate);
  const {
    data: apptsCount,
    isPending: apptsCountPending,
    error: apptsCountError,
  } = useJaneConsultationsCount(startDate, endDate);

  const {
    data: mostAttendedClasses,
    isPending: classesPending,
    error: classesError,
  } = useMostAttendedAcuityClasses(startDate, endDate);
  const {
    data: acuityAttendance,
    isPending: attendancePending,
    error: attendanceError,
  } = useAcuityAttendance(startDate, endDate);

  return (
    <div className="px-4 md:px-8 py-10 flex flex-col items-center gap-4">
      <div className="w-full max-w-7xl">
        <h1 className="font-bold">Home Dashboard</h1>
      </div>
      <HomeStatsCarousel />
      <div className="w-full max-w-7xl">
        <p>Home</p>
        {clientCountPending ? (
          <p>Loading...</p>
        ) : clientCountError ? (
          <p>Failed to fetch new clients</p>
        ) : (
          <p>New Jane clients in last month: {newClients}</p>
        )}

        {apptsCountPending ? (
          <p>Loading...</p>
        ) : apptsCountError ? (
          <p>Failed to fetch jane consultations</p>
        ) : (
          <p>Jane consultations in last month: {apptsCount}</p>
        )}

        {classesPending ? (
          <p>Loading...</p>
        ) : classesError ? (
          <p>Failed to fetch acuity classes</p>
        ) : (
          <p>
            Most Popular Classes:{" "}
            {mostAttendedClasses
              ?.slice(0, 3)
              .map((c) => `${c.class} (${c.attendance})`)
              .join(", ")}
          </p>
        )}

        {attendancePending ? (
          <p>Loading...</p>
        ) : attendanceError ? (
          <p>Failed to fetch acuity attendance</p>
        ) : (
          <p>Acuity attendance in last month: {acuityAttendance}</p>
        )}
      </div>
    </div>
  );
}
