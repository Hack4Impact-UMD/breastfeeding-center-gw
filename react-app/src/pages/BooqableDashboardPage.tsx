import { useMemo, useState } from "react";
import { BarChart, BarSeries, Bar, BarProps, LineChart } from "reaviz";
import {
  DateRangePicker,
  defaultPresets,
  defaultDateRange,
  DateRange,
} from "@/components/DateRangePicker/DateRangePicker";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortButton from "@/components/DataTable/ColumnSortButton";
import { Button } from "@/components/ui/button";
import { Export } from "@/components/export/Export";
import ExportTrigger from "@/components/export/ExportTrigger";
import ExportContent from "@/components/export/ExportContent";
import ExportOnly from "@/components/export/ExportOnly";
import { exportCsv } from "@/lib/tableExportUtils";
import { useBooqableRentalsInRange } from "@/hooks/queries/useBooqableRentalsInRange";
import { BooqableRental } from "@/services/booqableService";
import { DateTime } from "luxon";
import Loading from "@/components/Loading";

// record of colors to use for each rental item
const colors: Record<string, string> = {
  "Medela Symphony": "#05182A",
  "Ameda Platinum": "#FFB726",
  "Spectra S3": "#1264B1",
  "Medela BabyWeigh Scale": "#FFDD98",
  "Medela BabyCheck Scale": "#7EC8FF",
};

// custom bar component
function CustomBar(props: Partial<BarProps>) {
  console.log("CustomBar:", props.data?.key, colors[props.data!.key as string]);
  const label = props.data?.key;
  return (
    <Bar
      {...props}
      style={{
        fill: colors[label! as string] || "#000000",
      }}
    />
  );
}

// format the date to put in title
function formatDate(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear().toString().slice(-2);
  return `${m}/${d}/${y}`;
}

function useRentalsByWeek(rentals: BooqableRental[], startDate?: string, endDate?: string) {
  return useMemo(() => {
    if (!startDate || !endDate) return new Map();
    const rentalsByWeek = new Map<string, BooqableRental[]>()

    for (const rental of rentals) {
      const week = DateTime.fromISO(rental.firstPayDate).startOf("week").toISO();
      if (!week) continue;

      if (rentalsByWeek.has(week)) {
        rentalsByWeek.get(week)!.push(rental);
      } else {
        rentalsByWeek.set(week, [rental]);
      }
    }

    let start = DateTime.fromISO(startDate).startOf("week");
    const end = DateTime.fromISO(endDate).endOf("week")

    while (start < end) {
      const startIso = start.toISO();
      if (startIso) {
        if (!rentalsByWeek.has(startIso)) {
          rentalsByWeek.set(startIso, []);
        }
      }
      start = start.plus({ week: 1 });
    }

    return rentalsByWeek;
  }, [rentals, startDate, endDate])
}

export default function BooqableDashboardPage() {
  // use state for toggles/buttons/changing of information
  const [rentalDisplay, setRentalDisplay] = useState("graph");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );
  const { data: rentals, isPending, error } = useBooqableRentalsInRange(dateRange?.from?.toISOString(), dateRange?.to?.toISOString())

  const rentalsByWeek = useRentalsByWeek(rentals ?? [], dateRange?.from?.toISOString(), dateRange?.to?.toISOString());
  const chartData = useMemo(() => {
    const points = []
    for (const [week, rentals] of rentalsByWeek.entries()) {
      points.push({
        data: rentals.length,
        key: new Date(week)
      })
    }
    return points.sort((a, b) => a.key.getTime() - b.key.getTime())
  }, [rentalsByWeek]);


  const dateRangeLabel =
    dateRange?.from && dateRange?.to
      ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
      : "All Data";

  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";

  // // sample data
  // type RentalTableRow = {
  //   week: Date;
  //   rentals: number,
  //   totalRentalAmount: number,
  //   averageRentalAmount: number
  // };

  // data for table
  // const columns: ColumnDef<Rental>[] = [
  //   {
  //     accessorKey: "item",
  //     header: ({ column }) => {
  //       return <ColumnSortButton column={column}>Week</ColumnSortButton>;
  //     },
  //     cell: ({ row }) => (
  //       <span className="font-bold">{row.getValue("item")}</span>
  //     ),
  //   },
  //   {
  //     accessorKey: "durationMonths",
  //     header: ({ column }) => {
  //       return (
  //         <ColumnSortButton column={column}>
  //           Average Rental Duration (Months)
  //         </ColumnSortButton>
  //       );
  //     },
  //   },
  // ];

  return (
    <>
      <div className="flex flex-col py-14 space-y-5">
        {/* Page Title */}
        <div className={centerItemsInDiv}>
          <div>
            <h1 className="font-semibold text-3xl sm:text-4xl lg:text-5xl">
              Booqable
            </h1>
          </div>
          {/*date picker*/}
          <div className="w-60">
            <DateRangePicker
              enableYearNavigation
              defaultValue={defaultDateRange}
              onChange={(range) => setDateRange(range)}
              presets={defaultPresets}
              className="w-60"
            />
          </div>
        </div>
        {
          isPending ? (
            <Loading />
          ) : error ? (
            <p className="text-red-600">Failed to fetch Booqable data: {error.message}</p>
          ) : (
            <>
              {/* Graph/Table & Export Selection */}
              <Export title={`NewRentalsByWeek${dateRangeLabel}`}>
                <div className={`${centerItemsInDiv} pt-4`}>
                  <div className="flex flex-row">
                    <button
                      className={`${graphTableButtonStyle} ${rentalDisplay == "graph"
                        ? "bg-bcgw-gray-light"
                        : "bg-[#f5f5f5]"
                        }`}
                      onClick={() => setRentalDisplay("graph")}
                    >
                      Graph
                    </button>
                    <button
                      className={`${graphTableButtonStyle} ${rentalDisplay == "table"
                        ? "bg-bcgw-gray-light"
                        : "bg-[#f5f5f5]"
                        }`}
                      onClick={() => setRentalDisplay("table")}
                    >
                      Table
                    </button>
                  </div>
                  {rentalDisplay === "table" ? (
                    <Button
                      variant={"outlineGray"}
                      className={
                        "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
                      }
                      onClick={() =>
                        exportCsv(
                          [],
                          `booqable_avg_rental_duration${dateRange?.from?.toISOString()}_${dateRange?.to?.toISOString()}`,
                        )
                      }
                    >
                      Export
                    </Button>
                  ) : (
                    <ExportTrigger disabled={rentalDisplay !== "graph"} asChild>
                      <Button
                        variant={"outlineGray"}
                        className={
                          "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
                        }
                      >
                        Export
                      </Button>
                    </ExportTrigger>
                  )}
                </div>

                <span className="self-start font-semibold text-2xl">
                  New Rentals By Week, {dateRangeLabel}
                </span>
                {rentalDisplay === "graph" ? (
                  <div className="flex flex-col items-center justify-start bg-white min-h-[400px] border-2 border-black p-5 mt-5 rounded-2xl">
                    <ExportContent className="w-full">
                      <ExportOnly className="mb-5">
                        <h1 className="text-xl font-bold text-black">
                          New Rentals By Week
                        </h1>
                        <p className="text-base text-black">{dateRangeLabel}</p>
                      </ExportOnly>
                      <LineChart
                        height={500}
                        data={chartData}
                      />
                    </ExportContent>
                  </div>
                ) : (
                  <DataTable columns={[]} data={[]} tableType="default" />
                )}
              </Export>
            </>
          )
        }

      </div>
    </>
  );
}
