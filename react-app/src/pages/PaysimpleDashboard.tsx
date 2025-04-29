import { useState } from "react";
import {
  BarChart,
  BarSeries,
  LinearXAxis,
  LinearYAxis,
  Bar
} from "reaviz";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import Header from "../components/header";

function CustomBar(props: any) {
  const colors: Record<string, string> = {
    "Medela Symphony": "#05182A",
    "Ameda Platinum": "#FFB726",
    "Spectra S3": "#1264B1",
    "Medela BabyWeigh Scale": "#FFDD98",
    "Medela BabyCheck Scale": "#7EC8FF"
  };

  return (
    <Bar
      {...props}
      style={{
        fill: colors[String(props.id)] || "#000000"
      }}
      cornerRadius={8}
    />
  );
}

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

function formatDate(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear().toString().slice(-2);
  return `${m}/${d}/${y}`;
}

export default function PaysimpleDashboard() {
  const [viewMode, setViewMode] = useState("Months");
  const [chartView, setChartView] = useState("Graph");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { monday, sunday } = getWeekRange(selectedDate);
  const formattedRange = `${formatDate(monday)} - ${formatDate(sunday)}`;

  const dataMonths = [
    { key: "Medela Symphony", data: 14 },
    { key: "Ameda Platinum", data: 12 },
    { key: "Spectra S3", data: 9 },
    { key: "Medela BabyWeigh Scale", data: 9 },
    { key: "Medela BabyCheck Scale", data: 13 }
  ];

  const dataWeeks = dataMonths.map((item) => ({
    key: item.key,
    data: item.data * 4
  }));

  const displayData = viewMode === "Months" ? dataMonths : dataWeeks;

  const handleViewChange = (value: string) => {
    setViewMode(value);
  };

  return (
    <div className="flex min-h-screen">
      <NavigationBar />

      <div className="flex-1 flex flex-col transition-all duration-300 ml-64">
        <Header setNavBarOpen={() => {}} />

        <main className="p-6 space-y-6">
          <h1 className="text-3xl font-bold">PAYSIMPLE</h1>

          {/* Date Picker + Export */}
          <div className="flex justify-between items-center">
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

            <button className="bg-gray-200 border border-gray-400 text-sm px-4 py-1 rounded-md shadow">
              Export
            </button>
          </div>

          {/* Chart box */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-6 border">
            {/* Graph/Table Toggle + View Mode */}
            <div className="flex justify-between space-x-4">
              <div className="space-x-2">
                <button
                  className={`px-4 py-1 rounded-md border ${
                    chartView === "Graph"
                      ? "bg-gray-300 text-black"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => setChartView("Graph")}
                >
                  Graph
                </button>
                <button
                  className={`px-4 py-1 rounded-md border ${
                    chartView === "Table"
                      ? "bg-gray-300 text-black"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => setChartView("Table")}
                >
                  Table
                </button>
              </div>

              <select
                value={viewMode}
                onChange={(e) => handleViewChange(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="Months">Months</option>
                <option value="Weeks">Weeks</option>
              </select>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold">
              Average Rental Duration By Item, {formattedRange}
            </h2>

            {/* Chart or Table */}
            <div className="w-full h-[500px] flex">
              {chartView === "Graph" ? (
                <BarChart
                  width={700}
                  height={450}
                  data={displayData}
                  series={
                    <BarSeries
                      layout="horizontal"
                      bar={<CustomBar />}
                      barThickness={40}
                      xAxis={<LinearXAxis axisLine={true} tickLine={true} />}
                      yAxis={<LinearYAxis showGridLines={false} axisLine={true} tickLine={true} />}
                    />
                  }
                />
              ) : (
                <table className="w-full mt-4 text-left border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b">Item</th>
                      <th className="py-2 px-4 border-b">Duration ({viewMode})</th>
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
        </main>
      </div>
    </div>
  );
}
