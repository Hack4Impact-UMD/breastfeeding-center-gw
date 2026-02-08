import { useMemo, useState } from "react";
import { LineChart } from "reaviz";
import {
  DateRangePicker,
  defaultPresets,
  defaultDateRange,
  DateRange,
} from "@/components/DateRangePicker/DateRangePicker";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
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

type RentalTableRow = {
  week: Date;
  rentals: number,
  totalRentalAmount: number,
  averageRentalAmount: number
};

// format the date to put in title
function formatDate(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear().toString().slice(-2);
  return `${m}/${d}/${y}`;
}

const helper = createColumnHelper<RentalTableRow>()
const tableColumns = [
  helper.accessor("week", {
    header: ({ column }) => (
      <ColumnSortButton column={column}>
        Week Starting
      </ColumnSortButton>
    ),
    cell: ({ getValue }) => Intl.DateTimeFormat("en-us", {
      dateStyle: "short",
    }).format(getValue())
  }),
  helper.accessor("rentals", {
    header: ({ column }) => (
      <ColumnSortButton column={column}>
        Rentals
      </ColumnSortButton>
    )
  }),
  helper.accessor("averageRentalAmount", {
    header: ({ column }) => (
      <ColumnSortButton column={column}>
        Average Rental Amount
      </ColumnSortButton>
    ),
    cell: ({ getValue }) => `$${getValue().toFixed(2)}`
  }),
  helper.accessor("totalRentalAmount", {
    header: ({ column }) => (
      <ColumnSortButton column={column}>
        Total Rental Amount
      </ColumnSortButton>
    ),
    cell: ({ getValue }) => `$${getValue().toFixed(2)}`
  })
] as ColumnDef<RentalTableRow>[];

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
  const [rentalDisplay, setRentalDisplay] = useState("graph");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );
  const { data: rentals, isPending, error } = useBooqableRentalsInRange(dateRange?.from?.toISOString(), dateRange?.to?.toISOString())

  const rentalsByWeek: Map<string, BooqableRental[]> = useRentalsByWeek(rentals ?? [], dateRange?.from?.toISOString(), dateRange?.to?.toISOString());

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

  const tableData = useMemo(() => {
    const rows: RentalTableRow[] = []
    for (const [week, rentals] of rentalsByWeek.entries()) {
      const totalAmount = rentals.reduce((acc, r) => (r.amount / 100) + acc, 0);
      const avgAmount = rentals.length > 0 ? totalAmount / rentals.length : 0;
      rows.push({
        averageRentalAmount: avgAmount,
        totalRentalAmount: totalAmount,
        rentals: rentals.length,
        week: new Date(week)
      });
    }
    return rows;
  }, [rentalsByWeek])

  const dateRangeLabel =
    dateRange?.from && dateRange?.to
      ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
      : "All Data";

  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";

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
                  <DataTable columns={tableColumns} data={tableData} tableType="default" />
                )}
              </Export>
            </>
          )
        }

      </div>
    </>
  );
}
