import { DateTime } from "luxon";
import HomeCarouselSlide from "../HomeCarouselSlide";
import janeIcon from "@/assets/icons/janeIcon.png";
import { UserIcon } from "lucide-react";
import { useNewJaneClientsCount } from "@/hooks/queries/useNewJaneClientsCount";
import Loading from "@/components/Loading";
import { useJaneConsultationsCount } from "@/hooks/queries/useJaneConsultationsCount";

export default function JaneSlide() {
  const startDate = DateTime.now().startOf("month").startOf("day");
  const endDate = DateTime.now().endOf("month").endOf("day");

  console.log(`start = ${startDate.toISO()}, end = ${endDate.toISO()}`);

  const {
    data: newClients,
    isPending: clientsPending,
    error: clientsError,
  } = useNewJaneClientsCount(startDate, endDate);
  const {
    data: apptCount,
    isPending: apptsPending,
    error: apptsError,
  } = useJaneConsultationsCount(startDate, endDate);

  return (
    <HomeCarouselSlide className="relative h-128 max-h-[500px] p-6 px-12 lg:px-18">
      <svg
        className="absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 1355 529"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="153" cy="126" r="233" fill="#0F4374" fillOpacity="0.5" />
        <circle cx="1132" cy="559" r="150" fill="#0F4374" fillOpacity="0.5" />
      </svg>
      <div className="flex flex-col gap-4 lg:gap-10 items-center justify-center w-full h-full max">
        {clientsPending || apptsPending ? (
          <Loading />
        ) : clientsError ? (
          <p>Failed to fetch new Jane clients: {clientsError.message}</p>
        ) : apptsError ? (
          <p>Failed to fetch Jane appointments: {apptsError.message}</p>
        ) : (
          <>
            <div className="flex flex-row gap-4 lg:gap-8 z-10 items-center justify-center">
              <div className="bg-bcgw-yellow-dark rounded-full p-1 size-10 min-w-10 min-h-10 lg:size-20 lg:min-w-20 lg:min-h-20">
                <img
                  src={janeIcon}
                  alt="Jane icon"
                  className="size-full object-contain"
                />
              </div>
              <h1 className="font-semibold text-lg lg:text-4xl">
                JANE STATS FOR {startDate.monthLong.toUpperCase()}{" "}
              </h1>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 w-full max-w-4xl z-10 justify-center items-center">
              <div className="max-w-120 max-h-63 w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-4 lg:py-6 lg:gap-2">
                <UserIcon className="size-8 lg:size-15 p-2 bg-bcgw-yellow-dark rounded-full text-black" />
                <h1 className="text-bcgw-blue-light font-semibold text-3xl md:text-6xl">
                  {newClients}
                </h1>
                <span className="text-black lg:text-xl text-center">
                  New Clients This Month
                </span>
              </div>

              <div className="max-w-120 max-h-63 w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-4 lg:py-6 lg:gap-2">
                <UserIcon className="size-8 lg:size-15 p-2 bg-bcgw-yellow-dark rounded-full text-black" />
                <h1 className="text-bcgw-blue-light font-semibold text-3xl md:text-6xl">
                  {apptCount}
                </h1>
                <span className="text-black lg:text-xl text-center">
                  Total Consultations This Month
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </HomeCarouselSlide>
  );
}
