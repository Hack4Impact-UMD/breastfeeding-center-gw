import { useState, useRef } from "react";
import { BarChart, BarSeries, Bar, BarProps } from "reaviz";
import { toPng } from "html-to-image";
import download from "downloadjs";
import {
  DateRangePicker,
  defaultPresets,
  defaultDateRange,
} from "@/components/DateRangePicker/DateRangePicker";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortButton from "@/components/DataTable/ColumnSortIcon";

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
function getWeekRange(date: Date) {
  const selected = new Date(date);
  const day = selected.getDay(); // 0 (Sun) to 6 (Sat)
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(selected);
  monday.setDate(selected.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
}

// format the date to put in title
function formatDate(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear().toString().slice(-2);
  return `${m}/${d}/${y}`;
}

export default function PaysimpleDashboardPage() {
  // use state for toggles/buttons/changing of information
  const [rentalDisplay, setRentalDisplay] = useState("graph");
  //@ts-expect-error
  const [selectedDate, setSelectedDate] = useState(new Date());

  const rentalChartRef = useRef<HTMLDivElement>(null);
  const { monday, sunday } = getWeekRange(selectedDate);
  const formattedRange = `${formatDate(monday)} - ${formatDate(sunday)}`;

  const transparentGrayButtonStyle =
    "bg-transparent hover:bg-bcgw-gray-light text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";
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

  const handleExport = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string,
  ) => {
    const element = ref.current;
    if (!element) {
      return;
    }

    try {
      const dataUrl = await toPng(element);
      download(dataUrl, `${filename}.png`);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col p-8 pr-20 pl-20 space-y-5">
        {/* Page Title */}
        <div className={centerItemsInDiv}>
          <div>
            <h1 className="font-bold">Paysimple</h1>
          </div>
          {/*date picker*/}
          <div className="w-60">
            <DateRangePicker
              enableYearNavigation
              defaultValue={defaultDateRange}
              presets={defaultPresets}
              className="w-60"
            />
          </div>
        </div>

        {/* Graph/Table & Export Selection */}
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
          <button
            className={transparentGrayButtonStyle}
            onClick={() => handleExport(rentalChartRef, "rental_duration")}
          >
            Export
          </button>
        </div>

        {/* white card to put graph inside */}
        <div
          className={
            rentalDisplay === "graph"
              ? "bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black"
              : ""
          }
          ref={rentalChartRef}
        >
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold">
              Average Rental Duration By Item, {formattedRange}
            </div>
          </div>

          {/* the different elements rendered depending on the toggle buttons */}
          <div className="mt-1">
            {rentalDisplay === "graph" ? (
              <div className="w-full h-[500px] flex">
                <BarChart
                  height={500}
                  data={dataMonths}
                  series={<BarSeries layout="vertical" bar={<CustomBar />} />}
                />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={mockData}
                tableType="default"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
