import { useState } from "react";
import {
  LineChart,
  LineSeries,
  StackedBarChart,
  StackedBarSeries,
  Bar,
  Gradient,
  GradientStop,
  RangeLines,
  GuideBar,
} from "reaviz";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import Header from "../components/header";

export default function AcuityDashboard() {
  const [navBarOpen, setNavBarOpen] = useState(true);

  // ── CLASS dropdown state & data ───────────────────────────────
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const allClassData = [
    {
      key: "Midwife Education",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 30 },
        { key: new Date("2025-03-12"), data: 25 },
        { key: new Date("2025-03-19"), data: 15 },
      ],
    },
    {
      key: "Childbirth Classes",
      data: [
        { key: new Date("2025-02-19"), data: 8 },
        { key: new Date("2025-02-26"), data: 15 },
        { key: new Date("2025-03-05"), data: 22 },
        { key: new Date("2025-03-12"), data: 18 },
        { key: new Date("2025-03-19"), data: 12 },
      ],
    },
    {
      key: "Postpartum Classes",
      data: [
        { key: new Date("2025-02-19"), data: 1 },
        { key: new Date("2025-02-26"), data: 2 },
        { key: new Date("2025-03-05"), data: 3 },
        { key: new Date("2025-03-12"), data: 4 },
        { key: new Date("2025-03-19"), data: 5 },
      ],
    },
    {
      key: "Prenatal Classes",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 7 },
        { key: new Date("2025-03-12"), data: 9 },
        { key: new Date("2025-03-19"), data: 2 },
      ],
    },
    {
      key: "Infant Massage",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 12 },
        { key: new Date("2025-03-05"), data: 4 },
        { key: new Date("2025-03-12"), data: 5 },
        { key: new Date("2025-03-19"), data: 6 },
      ],
    },
  ];
  const filteredClassData =
    selectedClass === "All Classes"
      ? allClassData
      : allClassData.filter((item) => item.key === selectedClass);

  // ── INSTRUCTOR dropdown state & data ─────────────────────────
  const [selectedInstructor, setSelectedInstructor] =
    useState("All Instructors");
  const allInstructorData = [
    {
      key: "Midwife Education",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 15 },
        { key: new Date("2025-03-05"), data: 14 },
        { key: new Date("2025-03-12"), data: 18 },
        { key: new Date("2025-03-19"), data: 20 },
      ],
    },
    {
      key: "Childbirth Classes",
      data: [
        { key: new Date("2025-02-19"), data: 12 },
        { key: new Date("2025-02-26"), data: 14 },
        { key: new Date("2025-03-05"), data: 16 },
        { key: new Date("2025-03-12"), data: 13 },
        { key: new Date("2025-03-19"), data: 18 },
      ],
    },
  ];
  const filteredInstructorData =
    selectedInstructor === "All Instructors"
      ? allInstructorData
      : allInstructorData.filter((item) => item.key === selectedInstructor);

  // ── Order By dropdown state & data ─────────────────────────
  // Not implemented yet
  const [selectedOrder, setSelectedOrder] = useState("Order By");
  const allOrders = [
    {
      key: "Midwife Education",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 15 },
        { key: new Date("2025-03-05"), data: 14 },
        { key: new Date("2025-03-12"), data: 18 },
        { key: new Date("2025-03-19"), data: 20 },
      ],
    },
    {
      key: "Childbirth Classes",
      data: [
        { key: new Date("2025-02-19"), data: 12 },
        { key: new Date("2025-02-26"), data: 14 },
        { key: new Date("2025-03-05"), data: 16 },
        { key: new Date("2025-03-12"), data: 13 },
        { key: new Date("2025-03-19"), data: 18 },
      ],
    },
  ];

  const filteredOrderedData =
    selectedOrder === "Order By"
      ? allClassData
      : allClassData.filter((item) => item.key === selectedClass);

  return (
    <div className="flex min-h-screen">
      <NavigationBar />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          navBarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Header setNavBarOpen={setNavBarOpen} />

        <main className="p-6 space-y-10">
          <h1 className="text-3xl font-bold">ACUITY</h1>

          {/* Attendance Bar Chart */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black">
            <div className="flex justify-between items-center space-x-4">
              <h2 className="text-xl font-semibold">
                Class Attendance By Trimester, <br /> 2/19/25 - 3/19/25
              </h2>
              {/* Order By */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium"></label>
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                >
                  <option>Order By</option>
                  {allOrders.map((c) => (
                    <option key={c.key}>{c.key}</option>
                  ))}
                </select>
              </div>

              {/* Class dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium"></label>
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option>All Classes</option>
                  {allClassData.map((c) => (
                    <option key={c.key}>{c.key}</option>
                  ))}
                </select>
              </div>
              <button className="text-blue-600 text-sm">Export</button>
            </div>
            <div className="w-full h-96">
              <StackedBarChart
                width="100%"
                height={350}
                data={[
                  /* Can get data here from backend hard-coded for now. */
                  {
                    key: "Childbirth Classes",
                    data: [
                      { key: "1st Trimester", data: 10 },
                      { key: "2nd Trimester", data: 15 },
                      { key: "3rd Trimester", data: 20 },
                      { key: "Postpartum", data: 5 },
                    ],
                  },
                  {
                    key: "Midwife Education",
                    data: [
                      { key: "1st Trimester", data: 12 },
                      { key: "2nd Trimester", data: 18 },
                      { key: "3rd Trimester", data: 22 },
                      { key: "Postpartum", data: 8 },
                    ],
                  },
                  {
                    key: "Comfort, Communication...",
                    data: [
                      { key: "1st Trimester", data: 32 },
                      { key: "2nd Trimester", data: 5 },
                      { key: "3rd Trimester", data: 20 },
                      { key: "Postpartum", data: 9 },
                    ],
                  },
                  {
                    key: "2-Day Childbirth...",
                    data: [
                      { key: "1st Trimester", data: 21 },
                      { key: "2nd Trimester", data: 10 },
                      { key: "3rd Trimester", data: 17 },
                      { key: "Postpartum", data: 2 },
                    ],
                  },
                  {
                    key: "Evening...",
                    data: [
                      { key: "1st Trimester", data: 21 },
                      { key: "2nd Trimester", data: 10 },
                      { key: "3rd Trimester", data: 17 },
                      { key: "Postpartum", data: 2 },
                    ],
                  },
                  {
                    key: "Navigating Perinatal...",
                    data: [
                      { key: "1st Trimester", data: 21 },
                      { key: "2nd Trimester", data: 10 },
                      { key: "3rd Trimester", data: 17 },
                      { key: "Postpartum", data: 2 },
                    ],
                  },
                ]}
                series={
                  <StackedBarSeries
                    bar={
                      <Bar
                        rx={0}
                        ry={0}
                        gradient={
                          <Gradient
                            stops={[
                              <GradientStop
                                offset="5%"
                                stopOpacity={1.0}
                                key="start"
                              />,
                              <GradientStop
                                offset="90%"
                                stopOpacity={1.0}
                                key="stop"
                              />,
                            ]}
                          />
                        }
                        rangeLines={
                          <RangeLines position="top" strokeWidth={3} />
                        }
                        guide={<GuideBar />}
                      />
                    }
                    colorScheme={[
                      "#FCD484",
                      "#FFAA00",
                      "#5DB9FF",
                      "#1661A9",
                      "#05182A",
                    ]}
                  />
                }
              />
            </div>
          </div>

          {/* Class Popularity Over Time */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black">
            <div className="flex justify-between items-center space-x-4">
              <h2 className="text-xl font-semibold">
                Class Popularity Over Time, <br /> 2/19/25 - 3/19/25
              </h2>

              {/* Class dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium"></label>
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option>All Classes</option>
                  {allClassData.map((c) => (
                    <option key={c.key}>{c.key}</option>
                  ))}
                </select>
              </div>

              <button className="text-blue-600 text-sm">Export</button>
            </div>
            <div className="w-full h-96">
              <LineChart
                height={300}
                width="100%"
                data={filteredClassData}
                series={<LineSeries type="grouped" />}
              />
            </div>
          </div>

          {/* Instructor Popularity Over Time */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black">
            <div className="flex justify-between items-center space-x-4">
              <h2 className="text-xl font-semibold">
                Instructor Popularity Over Time,
                <br /> 2/19/25 - 3/19/25
              </h2>

              {/* Instructor dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium"></label>
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={selectedInstructor}
                  onChange={(e) => setSelectedInstructor(e.target.value)}
                >
                  <option>All Instructors</option>
                  {allInstructorData.map((ins) => (
                    <option key={ins.key}>{ins.key}</option>
                  ))}
                </select>
              </div>

              <button className="text-blue-600 text-sm">Export</button>
            </div>
            <div className="w-full h-96">
              <LineChart
                height={300}
                width="100%"
                data={filteredInstructorData}
                series={<LineSeries type="grouped" />}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
