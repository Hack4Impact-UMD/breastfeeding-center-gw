import { DateTime } from "luxon";
import HomeCarouselSlide from "../HomeCarouselSlide";
import booqableIcon from "@/assets/icons/booqableIcon.png";
import { Package, UserIcon } from "lucide-react";
import { useBooqableRentalsInRange } from "@/hooks/queries/useBooqableRentalsInRange";
import Loading from "@/components/Loading";
import { useMemo } from "react";

export default function BooqableSlide() {
  const startDate = DateTime.now().minus({ days: 30 }).startOf("day");
  const endDate = DateTime.now().endOf("day");

  const { data: rentals, isPending, error } = useBooqableRentalsInRange(startDate.toISO(), endDate.toISO());

  const uniqueClients: number = useMemo(() => {
    const clients = new Set<string>(rentals?.map(r => r.customerId));
    return clients.size
  }, [rentals]);

  return (
    <HomeCarouselSlide className="relative h-128 max-h-[500px] p-6 px-12 lg:px-18">
      <svg
        className="absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 1355 529"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="273" cy="126" r="253" fill="#0F4374" fillOpacity="0.5" />
        <circle cx="1292" cy="379" r="150" fill="#0F4374" fillOpacity="0.5" />
      </svg>
      <div className="flex flex-col gap-4 lg:gap-10 items-center justify-center w-full h-full max">
        {isPending ? (
          <Loading />
        ) : error ? (
          <p className="z-10">Failed to fetch Booqable rentals: {error.message}</p>
        ) : (
          <>
            <div className="flex flex-row gap-4 lg:gap-8 z-10 items-center justify-center">
              <div className="bg-bcgw-yellow-dark rounded-full p-1 size-10 min-w-10 min-h-10 lg:size-20 lg:min-w-20 lg:min-h-20 flex items-center justify-center">
                <img
                  src={booqableIcon}
                  alt="Booqable icon"
                  className="size-3/4 object-contain"
                />
              </div>
              <div>
                <h1 className="font-semibold text-lg lg:text-4xl">
                  BOOQABLE STATS: LAST 30 DAYS
                </h1>
                <p className="text-xs md:text-sm">
                  {startDate.toLocaleString({
                    month: "long",
                    day: "numeric"
                  })} - {endDate.toLocaleString({
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 w-full max-w-4xl z-10 justify-center items-center">
              <div className="max-w-120 max-h-63 w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-4 lg:py-6 lg:gap-2">
                <Package className="size-8 lg:size-15 p-2 bg-bcgw-yellow-dark rounded-full text-black" />
                <h1 className="text-bcgw-blue-light font-semibold text-3xl md:text-6xl">
                  {rentals.length}
                </h1>
                <span className="text-black lg:text-xl text-center">
                  New Rentals Started
                </span>
              </div>

              <div className="max-w-120 max-h-63 w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-4 lg:py-6 lg:gap-2">
                <UserIcon className="size-8 lg:size-15 p-2 bg-bcgw-yellow-dark rounded-full text-black" />
                <h1 className="text-bcgw-blue-light font-semibold text-3xl md:text-6xl">
                  {uniqueClients}
                </h1>
                <span className="text-black lg:text-xl text-center">
                  Unique Clients
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </HomeCarouselSlide>
  );
}
