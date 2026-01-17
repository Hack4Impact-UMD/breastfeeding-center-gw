import useAcuityAttendance from "@/hooks/queries/useAcuityAttendance";
import { useJaneConsultationsCount } from "@/hooks/queries/useJaneConsultationsCount";
import useMostAttendedAcuityClasses from "@/hooks/queries/useMostAttendedAcuityClasses";
import { useNewJaneClientsCount } from "@/hooks/queries/useNewJaneClientsCount";
import ServiceCard from "@/components/ServiceCard";
import dashboardImage from "@/assets/dashboard.jpg";
import janeIcon from "@/assets/icons/janeIcon.png";
import acuityIcon from "@/assets/icons/acuityIcon.png";
import booqableIcon from "@/assets/icons/booqableIcon.png";
import clientJourneyIcon from "@/assets/icons/clientJourneyIcon.png";
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

      <div className="flex flex-col items-center mb-8">
        <h2 className="text-[25px] md:text-3xl font-semibold text-[#1a1a2e] tracking-wide">
          OUR APPLICATIONS
        </h2>
        <div className="w-[85%] max-w-[200px] h-[2px] bg-yellow-400 mt-2" />
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 min-[769px]:grid-cols-2 gap-6 mb-10">
        <ServiceCard
          icon={<img src={janeIcon} alt="Jane icon" className="w-10 h-10" />}
          serviceName="Jane"
          serviceType="Client Management System"
          description="Jane manages client visits and appointments. View aggregated client visits data by visit type and retention rate, and filter by clinicians and client status."
          link="/services/jane"
        />
        <ServiceCard
          icon={<img src={acuityIcon} alt="Acuity icon" className="w-8 h-8" />}
          serviceName="Acuity"
          serviceType="Appointment Scheduling System"
          description="Acuity manages class scheduling and calendars. View most attended classes, broken down by instructor, trimester, and class type."
          link="/services/acuity"
        />
        <ServiceCard
          icon={<img src={booqableIcon} alt="Booqable icon" className="w-10 h-6" />}
          serviceName="Booqable"
          serviceType="Equipment Rental Management"
          description="Booqable tracks equipment inventory and rentals. View inventory levels, overdue items, and rental duration statistics by item."
          link="/services/booqable"
        />
        <ServiceCard
          icon={<img src={clientJourneyIcon} alt="Client Journey icon" className="w-8 h-8" />}
          serviceName="Client Journey"
          serviceType="Client Journey Analytics"
          description="Client Journey tracks all of a client's interactions, including rentals, appointments, classes and more. View client progression and engagement with services."
          link="/clients"
        />
      </div>
    </div>
  );
}