import { DateTime } from "luxon";
import { truncate } from "@/lib/utils";
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import HomeCarouselSlide from "../HomeCarouselSlide";
import acuityIcon from "@/assets/icons/acuityIcon.png";
import Loading from "@/components/Loading";
import useMostAttendedAcuityClasses from "@/hooks/queries/useMostAttendedAcuityClasses";
import useAcuityAttendance from "@/hooks/queries/useAcuityAttendance";

export default function AcuitySlide() {
  const startDate = DateTime.now().minus({ days: 30 }).startOf("day");
  const endDate = DateTime.now().endOf("day");

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
    <HomeCarouselSlide className="relative h-128 max-h-[500px] p-6 px-12 lg:px-18">
      <svg
        className="absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 1355 529"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="155" cy="520" r="150" fill="#0F4374" fillOpacity="0.5" />
        <circle cx="1172" cy="55" r="253" fill="#0F4374" fillOpacity="0.5" />
      </svg>
      <div className="flex flex-col gap-4 lg:gap-10 items-center justify-center w-full h-full max">
        {classesPending || attendancePending ? (
          <Loading />
        ) : classesError ? (
          <p className="z-10">
            Failed to fetch most attended Acuity classes: {classesError.message}
          </p>
        ) : attendanceError ? (
          <p className="z-10">
            Failed to fetch Acuity attendance: {attendanceError.message}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-row gap-4 lg:gap-8 z-10 items-center justify-center">
              <div className="bg-bcgw-yellow-dark rounded-full p-1 size-10 min-w-10 min-h-10 lg:size-20 lg:min-w-20 lg:min-h-20 flex justify-center items-center">
                <img
                  src={acuityIcon}
                  alt="Acuity icon"
                  className="size-3/4 object-contain"
                />
              </div>
              <h1 className="font-semibold text-lg lg:text-4xl">
                ACUITY STATS FOR THE LAST 30 DAYS
              </h1>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-7xl z-10 justify-center items-center mt-4 lg:mt-0">
              <span className="text-white lg:text-lg text-center">
                Top 3 Attended Classes
              </span>
              {mostAttendedClasses?.slice(0, 3).map((c, idx) => (
                <div
                  key={idx}
                  className="max-w-185 max-h-63 w-full h-full bg-white rounded-lg flex flex-row items-center justify-between px-4 py-2 lg:gap-2 text-xs lg:text-base"
                >
                  <div className="flex flex-row gap-4 items-center">
                    <span className="bg-bcgw-yellow-dark text-bcgw-blue-dark rounded-full p-1 size-5 min-w-5 min-h-5 lg:size-8 lg:min-w-8 lg:min-h-8 lg:text-lg flex justify-center items-center font-medium">
                      {idx + 1}
                    </span>
                    <Tooltip>
                      <TooltipTrigger className="text-left text-black">
                        <span className="sm:hidden">
                          {truncate(c.class, 20)}
                        </span>
                        <span className="hidden sm:inline">
                          {truncate(c.class, 65)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{c.class}</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="bg-bcgw-yellow-dark text-bcgw-blue-dark rounded-full py-1 px-2 w-fit min-w-fit flex justify-center gap-1">
                    <span className="font-medium">{c.attendance}</span> clients
                  </div>
                </div>
              ))}
              <div className="flex flex-row items-center gap-4">
                <h1 className="text-bcgw-yellow-dark font-medium text-3xl md:text-6xl">
                  {acuityAttendance}
                </h1>
                <span className="text-white lg:text-xl ">
                  Clients Attending Classes
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </HomeCarouselSlide>
  );
}
