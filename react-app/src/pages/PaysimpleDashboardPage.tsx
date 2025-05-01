import { useState, useRef } from "react";
import { BarChart, BarSeries, Bar } from "reaviz";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import Header from "../components/Header";
import { toPng } from "html-to-image";
import download from "downloadjs";

// record of colors to use for each rental item
const colors: Record<string, string> = {
  "Medela Symphony": "#05182A",
  "Ameda Platinum": "#FFB726",
  "Spectra S3": "#1264B1",
  "Medela BabyWeigh Scale": "#FFDD98",
  "Medela BabyCheck Scale": "#7EC8FF",
};

// custom bar component
function CustomBar(props: any) {
  console.log("CustomBar:", props.data?.key, colors[props.data?.key]);
  const label = props.data?.key;
  return (
    <Bar
      {...props}
      style={{
        fill: colors[label] || "#000000",
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
  const [navBarOpen, setNavBarOpen] = useState(true);
  // use state for toggles/buttons/changing of information
  const [viewMode, setViewMode] = useState("Months");
  const [rentalDisplay, setRentalDisplay] = useState("graph");
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

  // weeks data is different, multiply each month's data by 4
  const dataWeeks = dataMonths.map((item) => ({
    key: item.key,
    data: item.data * 4,
  }));

  const displayData = viewMode === "Months" ? dataMonths : dataWeeks;

  const handleViewChange = (value: string) => {
    setViewMode(value);
  };

  const handleExport = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string
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
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />

      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]" //set margin of content to 250px when nav bar is open and 60px when closed
        }`}>
        <Header />

        <div className="flex flex-col p-8 pr-20 pl-20 space-y-5">
          {/* Page Title */}
          <div className="flex flex-row justify-between">
            <h1 className="font-bold">PAYSIMPLE</h1>

            {/* Top-right: Date Picker */}
            <div className="flex justify-end">
              <div className="flex items-center gap-2">
                <label htmlFor="week-picker" className="text-sm font-medium">
                  Select Date
                </label>
                <input
                  id="week-picker"
                  type="date"
                  className="border rounded-md px-2 py-1 text-sm"
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Graph/Table & Export Selection */}
          <div className={`${centerItemsInDiv} pt-4`}>
            <div className="flex flex-row">
              <button
                className={`${graphTableButtonStyle} ${
                  rentalDisplay == "graph"
                    ? "bg-bcgw-gray-light"
                    : "bg-[#f5f5f5]"
                }`}
                onClick={() => setRentalDisplay("graph")}>
                Graph
              </button>
              <button
                className={`${graphTableButtonStyle} ${
                  rentalDisplay == "table"
                    ? "bg-bcgw-gray-light"
                    : "bg-[#f5f5f5]"
                }`}
                onClick={() => setRentalDisplay("table")}>
                Table
              </button>
            </div>
            <button
              className={transparentGrayButtonStyle}
              onClick={() => handleExport(rentalChartRef, "rental_duration")}>
              Export
            </button>
          </div>

          {/* white card to put info inside */}
          <div
            className="bg-white rounded-2xl shadow p-6 border space-y-6"
            ref={rentalChartRef}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Average Rental Duration By Item, {formattedRange}
              </h2>
              <select
                value={viewMode}
                onChange={(e) => handleViewChange(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm">
                <option value="Months">Months</option>
                <option value="Weeks">Weeks</option>
              </select>
            </div>

            {/* the different elements rendered depending on the toggle buttons */}
            <div className="mt-2">
              {rentalDisplay === "graph" ? (
                <div className="w-full h-[500px] flex">
                  <BarChart
                    height={500}
                    data={displayData}
                    series={<BarSeries layout="vertical" bar={<CustomBar />} />}
                  />
                </div>
              ) : (
                <table className="w-full mt-4 text-left border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b">Item</th>
                      <th className="py-2 px-4 border-b">
                        Duration ({viewMode})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((item) => (
                      <tr key={item.key}>
                        <td className="py-2 px-4 border-b">{item.key}</td>
                        <td className="py-2 px-4 border-b">{item.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Graph or Table Below */}
        </div>
      </div>
    </>
  );
}
