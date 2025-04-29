// import { useState } from "react";
import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  LineSeries,
  Line,
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
import { getClientAppointments } from "../backend/AcuityCalls";

export default function AcuityDashboard() {
  const [navBarOpen, setNavBarOpen] = useState(true);

  const [raw, setRaw] = useState<any[]>([]);

  // Styles
  const centerItemsInDiv = "flex justify-between items-center";
  const transparentGrayButtonStyle =
    "bg-transparent text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";

  // useEffect(() => {
  //   getClientAppointments()
  //     .then(data => setRaw(data))
  //     .catch(console.error)
  // }, [])

  // 1) state for your flat class list
  const [allClasses, setAllClasses] = useState<any[]>([]);

  // 2) on mount, fetch + normalize
  useEffect(() => {
    getClientAppointments()
      .then((res: any) => {
        // your API lives under res.result
        const byId = res.result ?? res;
        const clients = Object.values(byId);
        // flatten out the `classes` array on each client
        const flat = clients.flatMap((c: any) => c.classes || []);
        console.log("🔹 total bookings:", flat.length, flat[0]);
        setAllClasses(flat);
      })
      .catch(console.error);
  }, []);

  // 3) pivot into Reaviz series
  const classOverTime = useMemo(() => {
    const map = new Map<string, Map<number, number>>();
    allClasses.forEach((rec) => {
      const dt =
        typeof rec.date?.toDate === "function"
          ? rec.date.toDate()
          : new Date(rec.date);
      const ts = Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate());
      const key = rec.classType;
      if (!map.has(key)) map.set(key, new Map());
      const m = map.get(key)!;
      m.set(ts, (m.get(ts) || 0) + 1);
    });

    return Array.from(map.entries()).map(([cls, m]) => ({
      key: cls,
      data: Array.from(m.entries())
        .sort(([a], [b]) => a - b)
        .map(([ts, count]) => ({ key: new Date(ts), data: count })),
    }));
  }, [allClasses]);

  // ── CLASS dropdown state & data ───────────────────────────────
  const [selectedClass, setSelectedClass] = useState("All Classes");

  const allClassData = [
    {
      key: "Postpartum Classes",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 30 },
        { key: new Date("2025-03-12"), data: 25 },
        { key: new Date("2025-03-19"), data: 15 },
      ],
    },
    {
      key: "Prenatal Classes",
      data: [
        { key: new Date("2025-02-19"), data: 8 },
        { key: new Date("2025-02-26"), data: 15 },
        { key: new Date("2025-03-05"), data: 22 },
        { key: new Date("2025-03-12"), data: 18 },
        { key: new Date("2025-03-19"), data: 12 },
      ],
    },
    {
      key: "Infant Massage",
      data: [
        { key: new Date("2025-02-19"), data: 1 },
        { key: new Date("2025-02-26"), data: 2 },
        { key: new Date("2025-03-05"), data: 3 },
        { key: new Date("2025-03-12"), data: 4 },
        { key: new Date("2025-03-19"), data: 5 },
      ],
    },
    {
      key: "Parent Groups",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 7 },
        { key: new Date("2025-03-12"), data: 9 },
        { key: new Date("2025-03-19"), data: 2 },
      ],
    },
    {
      key: "Childbirth Classes",
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
  const [selectedInstructor, setSelectedInstructor] = useState("All Classes");
  const allInstructorData = [
    {
      key: "Postpartum Classes",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 30 },
        { key: new Date("2025-03-12"), data: 25 },
        { key: new Date("2025-03-19"), data: 15 },
      ],
    },
    {
      key: "Prenatal Classes",
      data: [
        { key: new Date("2025-02-19"), data: 8 },
        { key: new Date("2025-02-26"), data: 15 },
        { key: new Date("2025-03-05"), data: 22 },
        { key: new Date("2025-03-12"), data: 18 },
        { key: new Date("2025-03-19"), data: 12 },
      ],
    },
    {
      key: "Infant Massage",
      data: [
        { key: new Date("2025-02-19"), data: 1 },
        { key: new Date("2025-02-26"), data: 2 },
        { key: new Date("2025-03-05"), data: 3 },
        { key: new Date("2025-03-12"), data: 4 },
        { key: new Date("2025-03-19"), data: 5 },
      ],
    },
    {
      key: "Parent Groups",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 7 },
        { key: new Date("2025-03-12"), data: 9 },
        { key: new Date("2025-03-19"), data: 2 },
      ],
    },
    {
      key: "Childbirth Classes",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 12 },
        { key: new Date("2025-03-05"), data: 4 },
        { key: new Date("2025-03-12"), data: 5 },
        { key: new Date("2025-03-19"), data: 6 },
      ],
    },
  ];
  const filteredInstructorData =
    selectedInstructor === "All Classes"
      ? allInstructorData
      : allInstructorData.filter((item) => item.key === selectedInstructor);

  // ── Order By dropdown state & data ─────────────────────────
  // Not implemented yet
  const [selectedOrder, setSelectedOrder] = useState("Order By");
  const allOrders = [
    {
      key: "Postpartum Classes",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 30 },
        { key: new Date("2025-03-12"), data: 25 },
        { key: new Date("2025-03-19"), data: 15 },
      ],
    },
    {
      key: "Prenatal Classes",
      data: [
        { key: new Date("2025-02-19"), data: 8 },
        { key: new Date("2025-02-26"), data: 15 },
        { key: new Date("2025-03-05"), data: 22 },
        { key: new Date("2025-03-12"), data: 18 },
        { key: new Date("2025-03-19"), data: 12 },
      ],
    },
    {
      key: "Infant Massage",
      data: [
        { key: new Date("2025-02-19"), data: 1 },
        { key: new Date("2025-02-26"), data: 2 },
        { key: new Date("2025-03-05"), data: 3 },
        { key: new Date("2025-03-12"), data: 4 },
        { key: new Date("2025-03-19"), data: 5 },
      ],
    },
    {
      key: "Parent Groups",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 7 },
        { key: new Date("2025-03-12"), data: 9 },
        { key: new Date("2025-03-19"), data: 2 },
      ],
    },
    {
      key: "Childbirth Classes",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 12 },
        { key: new Date("2025-03-05"), data: 4 },
        { key: new Date("2025-03-12"), data: 5 },
        { key: new Date("2025-03-19"), data: 6 },
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

        <main className="bg-[#EAEAEA] p-6 space-y-5">
          <h1 className="text-3xl font-bold">ACUITY</h1>

          <div className={`${centerItemsInDiv} flex justify-end`}>
            <button
              className={transparentGrayButtonStyle}
              onClick={() => console.log("Exported")}
            >
              Export
            </button>
          </div>

          {/* Attendance Bar Chart */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black mb-20">
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
            </div>
            <div className="w-full h-96">
              <StackedBarChart
                width="100%"
                height={350}
                data={[
                  /* Can get data here from backend hard-coded for now. */
                  {
                    key: "Postpartum Classes",
                    data: [
                      { key: "FIRST TRIM", data: 10 },
                      { key: "SECOND TRIM", data: 15 },
                      { key: "THIRD TRIM", data: 20 },
                      { key: "FOURTH TRIM", data: 5 },
                      { key: "FIFTH TRIM", data: 5 },
                    ],
                  },
                  {
                    key: "Prenatal Classes",
                    data: [
                      { key: "FIRST TRIM", data: 7 },
                      { key: "SECOND TRIM", data: 1 },
                      { key: "THIRD TRIM", data: 2 },
                      { key: "FOURTH TRIM", data: 10 },
                      { key: "FIFTH TRIM", data: 3 },
                    ],
                  },
                  {
                    key: "Infant Massage",
                    data: [
                      { key: "FIRST TRIM", data: 1 },
                      { key: "SECOND TRIM", data: 4 },
                      { key: "THIRD TRIM", data: 3 },
                      { key: "FOURTH TRIM", data: 7 },
                      { key: "FIFTH TRIM", data: 10 },
                    ],
                  },
                  {
                    key: "Parent Groups",
                    data: [
                      { key: "FIRST TRIM", data: 9 },
                      { key: "SECOND TRIM", data: 6 },
                      { key: "THIRD TRIM", data: 19 },
                      { key: "FOURTH TRIM", data: 4 },
                      { key: "FIFTH TRIM", data: 7 },
                    ],
                  },
                  {
                    key: "Childbirth Classes",
                    data: [
                      { key: "FIRST TRIM", data: 13 },
                      { key: "SECOND TRIM", data: 16 },
                      { key: "THIRD TRIM", data: 21 },
                      { key: "FOURTH TRIM", data: 0 },
                      { key: "FIFTH TRIM", data: 0 },
                    ],
                  },
                ]}
                series={
                  <StackedBarSeries
                    bar={
                      <Bar
                        width={100}
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

          <div className={`${centerItemsInDiv} flex justify-end`}>
            <button
              className={transparentGrayButtonStyle}
              onClick={() => console.log("Exported")}
            >
              Export
            </button>
          </div>
          {/* Class Popularity Over Time */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black mb-20">
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
                  {allClassData.map((series) => (
                    <option key={series.key}>{series.key}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full h-96">
              <LineChart
                height={300}
                width="100%"
                data={
                  selectedClass === "All Classes"
                    ? classOverTime
                    : classOverTime.filter((c) => c.key === selectedClass)
                }
                series={
                  <LineSeries
                    type="grouped"
                    interpolation="linear"
                    line={<Line strokeWidth={3} />}
                    colorScheme="cybertron"
                  />
                }
              />
            </div>
          </div>

          <div className={`${centerItemsInDiv} flex justify-end`}>
            <button
              className={transparentGrayButtonStyle}
              onClick={() => console.log("Exported")}
            >
              Export
            </button>
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
                  <option>All Classes</option>
                  {allInstructorData.map((ins) => (
                    <option key={ins.key}>{ins.key}</option>
                  ))}
                </select>
              </div>
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
