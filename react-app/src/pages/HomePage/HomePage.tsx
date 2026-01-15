import useAcuityAttendance from "@/hooks/queries/useAcuityAttendance";
import { useJaneConsultationsCount } from "@/hooks/queries/useJaneConsultationsCount";
import useMostAttendedAcuityClasses from "@/hooks/queries/useMostAttendedAcuityClasses";
import { useNewJaneClientsCount } from "@/hooks/queries/useNewJaneClientsCount";
import { DateTime } from "luxon";
import { useMemo } from "react";

export default function HomePage() {
  const centerItemsInDiv = "flex justify-between items-center";

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
    // <div className="p-4">
    //   <p>Home</p>
    //   {clientCountPending ? (
    //     <p>Loading...</p>
    //   ) : clientCountError ? (
    //     <p>Failed to fetch new clients</p>
    //   ) : (
    //     <p>New Jane clients in last month: {newClients}</p>
    //   )}

    //   {apptsCountPending ? (
    //     <p>Loading...</p>
    //   ) : apptsCountError ? (
    //     <p>Failed to fetch jane consultations</p>
    //   ) : (
    //     <p>Jane consultations in last month: {apptsCount}</p>
    //   )}

    //   {classesPending ? (
    //     <p>Loading...</p>
    //   ) : classesError ? (
    //     <p>Failed to fetch acuity classes</p>
    //   ) : (
    //     <p>
    //       Most Popular Classes:{" "}
    //       {mostAttendedClasses
    //         ?.slice(0, 3)
    //         .map((c) => `${c.class} (${c.attendance})`)
    //         .join(", ")}
    //     </p>
    //   )}

    //   {attendancePending ? (
    //     <p>Loading...</p>
    //   ) : attendanceError ? (
    //     <p>Failed to fetch acuity attendance</p>
    //   ) : (
    //     <p>Acuity attendance in last month: {acuityAttendance}</p>
    //   )}
    // </div>

    <div className="flex flex-col py-14 px-10 sm:px-20">
      {/*headings*/}
      <div className={centerItemsInDiv}>
        <div className="flex flex-row">
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl grow">
            Home Dashboard
          </h1>
        </div>
      </div>
    </div>
  );
}
