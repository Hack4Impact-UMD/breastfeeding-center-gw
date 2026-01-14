import { useState } from "react";
import { BarChart, BarSeries, Bar, BarProps } from "reaviz";
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

// getting the date from user input
// function getWeekRange(date: Date) {
//   const selected = new Date(date);
//   const day = selected.getDay(); // 0 (Sun) to 6 (Sat)
//   const diffToMonday = (day === 0 ? -6 : 1) - day;
//   const monday = new Date(selected);
//   monday.setDate(selected.getDate() + diffToMonday);
//   const sunday = new Date(monday);
//   sunday.setDate(monday.getDate() + 6);
//   return { monday, sunday };
// }

// format the date to put in title
function formatDate(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear().toString().slice(-2);
  return `${m}/${d}/${y}`;
}

export default function BooqableDashboardPage() {
  // use state for toggles/buttons/changing of information
  const [rentalDisplay, setRentalDisplay] = useState("graph");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );
  const dateRangeLabel =
    dateRange?.from && dateRange?.to
      ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
      : "All Data";

  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";

  // data
  const dataMonths = [
    { key: "Medela Symphony", data: 14 },
    { key: "Ameda Platinum", data: 12 },
    { key: "Spectra S3", data: 9 },
    { key: "Medela BabyWeigh Scale", data: 9 },
    { key: "Medela BabyCheck Scale", data: 13 },
  ];

  // sample data
  type Rental = {
    item: string;
    durationMonths: number;
  };

  // data for table
  const columns: ColumnDef<Rental>[] = [
    {
      accessorKey: "item",
      header: ({ column }) => {
        return <ColumnSortButton column={column}>Item</ColumnSortButton>;
      },
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("item")}</span>
      ),
    },
    {
      accessorKey: "durationMonths",
      header: ({ column }) => {
        return (
          <ColumnSortButton column={column}>
            Average Rental Duration (Months)
          </ColumnSortButton>
        );
      },
    },
  ];

  const mockData: Rental[] = [
    { item: "Medela Symphony", durationMonths: 2 },
    { item: "Ameda Platinum", durationMonths: 3 },
    { item: "Spectra S3", durationMonths: 4 },
    { item: "Medela Babyweigh Scale", durationMonths: 3 },
    { item: "Medela Babychecker Scale", durationMonths: 3 },
  ];

  return (
    <>
      <div className="flex flex-col py-14 px-10 sm:px-20 space-y-5">
        {/* Page Title */}
        <div className={centerItemsInDiv}>
          <div>
            <h1 className="font-bold text-4xl lg:text-5xl">Booqable</h1>
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

        {/* Graph/Table & Export Selection */}
        <Export title={`AverageRentalDuration${dateRangeLabel}`}>
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
                    mockData,
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
            Average Rental Duration By Item, {dateRangeLabel}
          </span>
          {rentalDisplay === "graph" ? (
            <div className="flex flex-col items-center justify-start bg-white min-h-[400px] border-2 border-black p-5 mt-5 rounded-2xl">
              <ExportContent className="w-full">
                <ExportOnly className="mb-5">
                  <h1 className="text-xl font-bold text-black">
                    Average Rental Duration by Item
                  </h1>
                  <p className="text-base text-black">{dateRangeLabel}</p>
                </ExportOnly>
                <BarChart
                  height={500}
                  data={dataMonths}
                  series={<BarSeries layout="vertical" bar={<CustomBar />} />}
                />
              </ExportContent>
            </div>
          ) : (
            <DataTable columns={columns} data={mockData} tableType="default" />
          )}
        </Export>
      </div>
    </>
  );
}
