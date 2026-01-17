import useAcuityAttendance from "@/hooks/queries/useAcuityAttendance";
import { useJaneConsultationsCount } from "@/hooks/queries/useJaneConsultationsCount";
import useMostAttendedAcuityClasses from "@/hooks/queries/useMostAttendedAcuityClasses";
import { useNewJaneClientsCount } from "@/hooks/queries/useNewJaneClientsCount";
import ServiceCard from "@/components/ServiceCard";
import dashboardImage from "@/assets/dashboard.jpg";
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

    <div className="flex flex-col py-8 px-6 sm:px-12 md:px-16 lg:px-20">
      <h1 className="font-bold text-[32px] md:text-[36px] text-[#1a1a2e] mb-8">
        Home Dashboard
      </h1>

      <div className="relative h-[200px] md:h-[200px] lg:h-[400px] xl:h-[280px] rounded-xl overflow-hidden mb-10">
        <img
          src={dashboardImage}
          alt="Dashboard banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-blue-500/25" />

        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white text-[35px] md:text-[35px] lg:text-[40px] font-semibold">
            Word
          </h2>
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7 mb-10">
        <ServiceCard
          icon=""
          serviceName="Jane"
          serviceType="Client Management System"
          description="Jane manages client visits and appointments. View aggregated client visits data by visit type and retention rate, and filter by clinicians and client status."
          link="/jane"
        />
        <ServiceCard
          icon=""
          serviceName="Acuity"
          serviceType="Appointment Scheduling System"
          description="Acuity manages class scheduling and calendars. View most attended classes, broken down by instructor, trimester, and class type."
          link="/acuity"
        />
        <ServiceCard
          icon=""
          serviceName="Booqable"
          serviceType="Equipment Rental Management"
          description="Booqable tracks equipment inventory and rentals. View inventory levels, overdue items, and rental duration statistics by item."
          link="/analytics"
        />
        <ServiceCard
          icon=""
          serviceName="Client Journey"
          serviceType="Client Journey Analytics"
          description="Client Journey tracks all of a client's BCGW interactions, including rentals, appointments, classes and more. View client progression and engagement with BCGW services."
          link="/settings"
        />
      </div>
    </div>
  );
}

// export default function ServiceCard({
//     icon,
//     serviceName,
//     serviceType,
//     description,
//     link 