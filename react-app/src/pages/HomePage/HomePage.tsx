import HomeStatsCarousel from "@/components/HomeStats/HomeStatsCarousel";
import ServiceCard from "@/components/ServiceCard";
import janeIcon from "@/assets/icons/janeIcon.png";
import acuityIcon from "@/assets/icons/acuityIcon.png";
import booqableIcon from "@/assets/icons/booqableIcon.png";
import clientJourneyIcon from "@/assets/icons/clientJourneyIcon.png";

export default function HomePage() {
  return (
    <div className="px-4 md:px-8 py-10 flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col gap-4">
        <div className="w-full">
          <h1 className="font-semibold text-[32px] md:text-[36px] text-[#1a1a2e]">
            Home Dashboard
          </h1>
        </div>

        <HomeStatsCarousel />

        <div className="flex flex-col items-center my-8">
          <h1 className="text-[25px] md:text-3xl font-semibold text-[#1a1a2e] tracking-wide">
            OUR APPLICATIONS
          </h1>
          <div className="w-[85%] max-w-[200px] h-0.5 bg-yellow-400 mt-2" />
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <ServiceCard
            icon={<img src={janeIcon} alt="Jane icon" className="w-10 h-10" />}
            serviceName="Jane"
            serviceType="Client Management System"
            description="Jane manages client visits and appointments. View aggregated client visits data by visit type and retention rate, and filter by clinicians and client status."
            link="/services/jane"
          />
          <ServiceCard
            icon={
              <img src={acuityIcon} alt="Acuity icon" className="w-8 h-8" />
            }
            serviceName="Acuity"
            serviceType="Appointment Scheduling System"
            description="Acuity manages class scheduling and calendars. View most attended classes, broken down by instructor, trimester, and class type."
            link="/services/acuity"
          />
          <ServiceCard
            icon={
              <img
                src={booqableIcon}
                alt="Booqable icon"
                className="w-10 h-6"
              />
            }
            serviceName="Booqable"
            serviceType="Equipment Rental Management"
            description="Booqable tracks equipment inventory and rentals. View inventory levels, overdue items, and rental duration statistics by item."
            link="/services/booqable"
          />
          <ServiceCard
            icon={
              <img
                src={clientJourneyIcon}
                alt="Client Journey icon"
                className="w-8 h-8"
              />
            }
            serviceName="Client Journey"
            serviceType="Client Journey Analytics"
            description="Client Journey tracks all of a client's BCGW interactions, including rentals, appointments, classes and more. View client progression and engagement with services."
            link="/clients"
          />
        </div>
      </div>
    </div>
  );
}
