import { useState, useRef, useMemo } from "react";
import {
  LineChart,
  LineSeries,
  StackedBarChart,
  StackedBarSeries,
  Bar,
  BarChart,
  BarSeries,
  Gradient,
  GradientStop,
  RangeLines,
  GuideBar,
} from "reaviz";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Header from "../../components/Header";
// import { getClientAppointments } from "../backend/AcuityCalls";
import { toPng } from "html-to-image";
import download from "downloadjs";
import {
  DateRangePicker,
  defaultPresets,
  defaultDateRange,
} from "@/components/DateRangePicker/DateRangePicker";
import { DataTable } from "@/components/DataTable/DataTable";
import {
  TrimesterAttendance,
  trimesterColumns,
  InstructorAttendance,
  instructorColumns,
} from "./AcuityTableColumns";

export default function AcuityDashboardPage() {
  const [navBarOpen, setNavBarOpen] = useState<boolean>(true);
  // const [allClasses, setAllClasses] = useState<any[]>([]);
  const [attendanceDisplay, setAttendanceDisplay] = useState<string>("graph");
  const [classPopularityDisplay, setClassPopularityDisplay] =
    useState<string>("graph");
  const [instructorPopularityDisplay, setInstructorPopularityDisplay] =
    useState<string>("graph");
  const attendanceChartRef = useRef<HTMLDivElement>(null);
  const classPopularityChartRef = useRef<HTMLDivElement>(null);
  const instructorPopularityChartRef = useRef<HTMLDivElement>(null);

  // ── CLASS dropdown state & data ───────────────────────────────
  const [selectedClass, setSelectedClass] = useState("All Classes");

  const trimesterAttendanceData = [
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
  ];

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

  const allClassAttendanceData = [
    {
      key: "Postpartum Classes",
      data: [
        { key: "Optimizing Sleep, Prenatal", data: 10 },
        { key: "Perinatal Rights at Work", data: 12 },
        { key: "Pumping Strategies + RTW", data: 8 },
        { key: "Starting Solids - Feeding 101", data: 15 },
        { key: "Feeding 102 - Overcoming Challenges in Feeding", data: 6 },
        { key: "Postpartum Nutrition", data: 3 },
        { key: "Rose PT Postpartum Pelvic Health", data: 3 },
        { key: "Bottles & Other Feeding Tools", data: 3 },
      ],
    },
    {
      key: "Prenatal Classes",
      data: [
        { key: "Breastfeeding + Pumping Basics", data: 7 },
        { key: "Baby Care", data: 9 },
        { key: "Babywearing 101", data: 14 },
        { key: "Financial Planning for Baby", data: 5 },
        { key: "Rose PT Prenatal Pelvic Health", data: 11 },
        { key: "Bottles & Other Feeding Tools", data: 2 },
      ],
    },
    {
      key: "Infant Massage",
      data: [{ key: "Infant Massage", data: 7 }],
    },
    {
      key: "Parent Groups",
      data: [
        { key: "Navigating Perinatal Stress", data: 7 },
        { key: "Feeding + Postpartum with 0-4m Olds", data: 9 },
        { key: "Feeding + Postpartum with 4-12m Olds", data: 14 },
        { key: "Feeding + Postpartum with Toddlers", data: 5 },
      ],
    },
    {
      key: "Childbirth Classes",
      data: [
        { key: "Childbirth Express", data: 7 },
        { key: "Natural Childbirth", data: 9 },
        { key: "Doula Meet + Greet", data: 14 },
        { key: "Comfort, Communication & Positions", data: 5 },
        { key: "Evening Lamaze Series", data: 11 },
        { key: "Prep for Postpartum Recovery", data: 2 },
      ],
    },
  ];

  const trimesterData: TrimesterAttendance[] = [
    {
      class: "Prenatal R...",
      category: "Postpartum",
      first: 11,
      second: 17,
      third: 7,
      fourth: 2,
      fifth: 17,
      total: 10,
    },
    {
      class: "Baby Care",
      category: "Prenatal",
      first: 7,
      second: 3,
      third: 3,
      fourth: 3,
      fifth: 3,
      total: 3,
    },
    {
      class: "Postpartum...",
      category: "Postpartum",
      first: 12,
      second: 5,
      third: 11,
      fourth: 3,
      fifth: 3,
      total: 9,
    },
    {
      class: "Bottles & O...",
      category: "Postpartum",
      first: 4,
      second: 7,
      third: 21,
      fourth: 8,
      fifth: 1,
      total: 3,
    },
    {
      class: "Starting S...",
      category: "Postpartum",
      first: 17,
      second: 11,
      third: 5,
      fourth: 0,
      fifth: 2,
      total: 1,
    },
  ];

  const instructorData: InstructorAttendance[] = [
    {
      class: "Prenatal R...",
      category: "Postpartum",
      total_attendance: 30,
      instructor1_attendance: 11,
      instructor2_attendance: 11,
    },
    {
      class: "Baby Care",
      category: "Prenatal",
      total_attendance: 15,
      instructor1_attendance: 7,
      instructor2_attendance: 7,
    },
    {
      class: "Postpartum...",
      category: "Postpartum",
      total_attendance: 32,
      instructor1_attendance: 17,
      instructor2_attendance: 10,
    },
    {
      class: "Bottle & O...",
      category: "Postpartum",
      total_attendance: 22,
      instructor1_attendance: 1,
      instructor2_attendance: 19,
    },
    {
      class: "Starting S...",
      category: "Postpartum",
      total_attendance: 32,
      instructor1_attendance: 13,
      instructor2_attendance: 15,
    },
  ];

  // Styles
  const centerItemsInDiv = "flex justify-between items-center";
  const transparentGrayButtonStyle =
    "bg-transparent hover:bg-bcgw-gray-light text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";
  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer";

  // Fetch data on mount
  // useEffect(() => {
  // getClientAppointments()
  //   .then((res) => {
  //     // your API lives under res.result
  //     const byId = res.result ?? res;
  //     const clients = Object.values(byId);
  //     // flatten out the `classes` array on each client
  //     const flat = clients.flatMap((c) => c.classes || []);
  //     console.log("🔹 total bookings:", flat.length, flat[0]);
  //     setAllClasses(flat);
  //   })
  //   .catch(console.error);
  // }, []);

  // 3) pivot into Reaviz series
  // const classOverTime = useMemo(() => {
  //   const map = new Map();
  //   allClasses.forEach((rec) => {
  //     const dt =
  //       typeof rec.date?.toDate === "function"
  //         ? rec.date.toDate()
  //         : new Date(rec.date);
  //     const ts = Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate());
  //     const key = rec.classType;
  //     if (!map.has(key)) map.set(key, new Map());
  //     const m = map.get(key);
  //     m.set(ts, (m.get(ts) || 0) + 1);
  //   });

  //   return Array.from(map.entries()).map(([cls, m]) => ({
  //     key: cls,
  //     data: Array.from(m.entries())
  //       .sort(([a], [b]) => a - b)
  //       .map(([ts, count]) => ({ key: new Date(ts), data: count })),
  //   }));
  // }, [allClasses]);

  // Filter class data based on selection
  const filteredClassData =
    selectedClass === "All Classes"
      ? allClassData
      : allClassData.filter((item) => item.key === selectedClass);

  const filteredClassBars =
    selectedClass === "All Classes"
      ? []
      : allClassAttendanceData.filter((c) => c.key === selectedClass);

  const barData = filteredClassBars[0]?.data ?? [];

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

  // ── INSTRUCTOR dropdown state & data ─────────────────────────
  const [selectedInstructor, setSelectedInstructor] = useState("All Classes");

  const typeToCategory: Record<string, string> = {
    "Postpartum Classes": "Postpartum",
    "Prenatal Classes": "Prenatal",
    "Infant Massage": "Infant Massage",
    "Parent Groups": "Parent Groups",
    "Childbirth Classes": "Childbirth",
  };

  const instructorTableRows = useMemo(() => {
    if (selectedInstructor === "All Classes") return instructorData;
    const cat = typeToCategory[selectedInstructor] ?? selectedInstructor;
    return instructorData.filter((r) => r.category === cat);
  }, [selectedInstructor, instructorData]);

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
  // const [selectedOrder, setSelectedOrder] = useState("Order By");

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]" //set margin of content to 250px when nav bar is open and 60px when closed
        }`}
      >
        <Header />
        <div className="flex flex-col p-8 pr-20 pl-20 space-y-5">
          <div className={centerItemsInDiv}>
            <div>
              <h1 className="font-bold">ACUITY</h1>
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
          <div className={`${centerItemsInDiv} pt-4`}>
            <div className="flex flex-row">
              <button
                className={`${graphTableButtonStyle} ${
                  attendanceDisplay == "graph"
                    ? "bg-bcgw-gray-light"
                    : "bg-[#f5f5f5]"
                }`}
                onClick={() => setAttendanceDisplay("graph")}
              >
                Graph
              </button>
              <button
                className={`${graphTableButtonStyle} ${
                  attendanceDisplay == "table"
                    ? "bg-bcgw-gray-light"
                    : "bg-[#f5f5f5]"
                }`}
                onClick={() => setAttendanceDisplay("table")}
              >
                Table
              </button>
            </div>
            <button
              className={transparentGrayButtonStyle}
              onClick={() =>
                handleExport(attendanceChartRef, "class_attendance")
              }
            >
              Export
            </button>
          </div>

          {/* Attendance Bar Chart */}
          <div
            className={
              attendanceDisplay === "graph"
                ? "bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black"
                : ""
            }
            ref={attendanceChartRef}
          >
            <div className="flex justify-between items-center space-x-4">
              <div className="mb-5 text-2xl font-semibold">
                Class Attendance By Trimester,{" "}
                {attendanceDisplay === "graph" ? <br /> : <></>}2/19/25 -
                3/19/25
              </div>
              {attendanceDisplay === "graph" ? (
                // Class dropdown
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
              ) : (
                <></>
              )}
            </div>

            {attendanceDisplay === "graph" ? (
              <div className="w-full h-96">
                {selectedClass === "All Classes" ? (
                  /* stacked chart for all classes: */
                  <StackedBarChart
                    height={350}
                    data={trimesterAttendanceData}
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
                                    key="end"
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
                ) : (
                  /* single-series bar chart for one class: */
                  <BarChart
                    height={350}
                    data={barData}
                    series={
                      <BarSeries
                        padding={0.1}
                        colorScheme={"#F4BB47"}
                        bar={<Bar rx={0} ry={0} style={{ fill: "#F4BB47" }} />}
                      />
                    }
                  />
                )}
              </div>
            ) : (
              <section className="border-[2px] border-[#000000] rounded-none overflow-hidden">
                {/* blue strip with Class Type dropdown */}
                <div className="flex items-center justify-end bg-[#CED8E1] px-3 py-2 border-b-0">
                  <select
                    className="h-9 rounded-md border bg-white px-3 text-sm"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option>All Classes</option>
                    {allClassData.map((c) => (
                      <option key={c.key}>{c.key}</option>
                    ))}
                  </select>
                </div>

                {/* styled DataTable */}
                <div className="bcgw-acuity-table">
                  <DataTable
                    columns={trimesterColumns}
                    data={trimesterData}
                    tableType="default"
                  />
                </div>
              </section>
            )}
          </div>

          <div className={`${centerItemsInDiv} pt-8`}>
            <div className="flex flex-row">
              <button
                className={`${graphTableButtonStyle} ${
                  classPopularityDisplay == "graph"
                    ? "bg-bcgw-gray-light"
                    : "bg-[#f5f5f5]"
                }`}
                onClick={() => setClassPopularityDisplay("graph")}
              >
                Graph
              </button>
              <button
                className={`${graphTableButtonStyle} ${
                  classPopularityDisplay == "table"
                    ? "bg-bcgw-gray-light"
                    : "bg-[#f5f5f5]"
                }`}
                onClick={() => setClassPopularityDisplay("table")}
              >
                Table
              </button>
            </div>
            <button
              className={transparentGrayButtonStyle}
              onClick={() =>
                handleExport(classPopularityChartRef, "class_popularity")
              }
            >
              Export
            </button>
          </div>

          {/* Class Popularity Over Time */}
          <div
            className={
              classPopularityDisplay === "graph"
                ? "bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black"
                : ""
            }
            ref={classPopularityChartRef}
          >
            <div className="flex justify-between items-center space-x-4">
              <div className="mb-5 text-2xl font-semibold">
                Class Popularity Over Time,{" "}
                {classPopularityDisplay === "graph" ? <br /> : <></>} 2/19/25 -
                3/19/25
              </div>

              {classPopularityDisplay === "graph" && (
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
              )}
            </div>
            {classPopularityDisplay === "graph" ? (
              <div className="w-full h-96">
                <LineChart
                  height={300}
                  data={filteredClassData}
                  series={<LineSeries type="grouped" />}
                />
              </div>
            ) : (
              <section className="border-[2px] border-[#000000] rounded-none overflow-hidden">
                {/* blue strip with Class Type dropdown */}
                <div className="flex items-center justify-end bg-[#CED8E1] px-3 py-2 border-b-0">
                  <select
                    className="h-9 rounded-md border bg-white px-3 text-sm"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option>All Classes</option>
                    {allClassData.map((c) => (
                      <option key={c.key}>{c.key}</option>
                    ))}
                  </select>
                </div>

                {/* styled DataTable (using current placeholder columns/data) */}
                <div className="bcgw-acuity-table">
                  <DataTable
                    columns={
                      instructorColumns
                    } /* keep until you have class-popularity columns */
                    data={instructorData}
                    tableType="default"
                  />
                </div>
              </section>
            )}
          </div>

          <div className={`${centerItemsInDiv} pt-8`}>
            <div className="flex flex-row">
              <button
                className={`${graphTableButtonStyle} ${
                  instructorPopularityDisplay == "graph"
                    ? "bg-bcgw-gray-light"
                    : "bg-[#f5f5f5]"
                }`}
                onClick={() => setInstructorPopularityDisplay("graph")}
              >
                Graph
              </button>
              <button
                className={`${graphTableButtonStyle} ${
                  instructorPopularityDisplay == "table"
                    ? "bg-bcgw-gray-light"
                    : "bg-[#f5f5f5]"
                }`}
                onClick={() => setInstructorPopularityDisplay("table")}
              >
                Table
              </button>
            </div>
            <button
              className={transparentGrayButtonStyle}
              onClick={() =>
                handleExport(
                  instructorPopularityChartRef,
                  "instructor_popularity",
                )
              }
            >
              Export
            </button>
          </div>

          {/* Instructor Popularity Over Time */}
          <div
            className={
              instructorPopularityDisplay === "graph"
                ? "bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black"
                : ""
            }
            ref={instructorPopularityChartRef}
          >
            <div className="flex justify-between items-center space-x-4">
              <div className="mb-5 text-2xl font-semibold">
                Instructor Popularity Over Time,
                {instructorPopularityDisplay === "graph" ? <br /> : null}{" "}
                2/19/25 - 3/19/25
              </div>

              {/* header select only in GRAPH view */}
              {instructorPopularityDisplay === "graph" && (
                <div className="flex items-center space-x-2">
                  <select
                    className="border rounded-md px-3 py-2 text-sm"
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                  >
                    <option>All Classes</option>
                    {allInstructorData.map((ins) => (
                      <option key={ins.key}>{ins.key}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {instructorPopularityDisplay === "graph" ? (
              <div className="w-full h-96">
                <LineChart
                  height={300}
                  data={filteredInstructorData}
                  series={<LineSeries type="grouped" />}
                />
              </div>
            ) : (
              // ===== TABLE MODE =====
              <section className="border-[2px] border-[#000000] rounded-none overflow-hidden">
                {/* blue strip w/ dropdown (Figma) */}
                <div className="flex items-center justify-end bg-[#CED8E1] px-3 py-2 border-b-0">
                  <select
                    className="h-9 rounded-md border bg-white px-3 text-sm"
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                  >
                    <option>ALL CLASSES</option>
                    {allInstructorData.map((ins) => (
                      <option key={ins.key}>{ins.key}</option>
                    ))}
                  </select>
                </div>

                {/* wrap DataTable to target styles without a CSS file */}
                <div className="bcgw-acuity-table">
                  <DataTable
                    columns={instructorColumns}
                    data={instructorTableRows}
                    tableType="default"
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      <style>{`


  .bcgw-acuity-table > div {
    border: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
    
  .bcgw-acuity-table table {
    border: 0;
    border-collapse: separate;
    border-spacing: 0;
    margin: 0;
    width: 100%;
  }

  /* header (new blue) + single line under it */
  .bcgw-acuity-table thead th {
    background: #CED8E1;          /* << new blue */
    font-weight: 700;
    border-top: 1px solid #000000;
    border-bottom: 1px solid #000000;
  }

  /* compact cells */
  .bcgw-acuity-table thead th,
  .bcgw-acuity-table tbody td {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }

  .bcgw-acuity-table thead th:first-child,
  .bcgw-acuity-table tbody td:first-child {
    padding-left: 20px; 
  }

  .bcgw-acuity-table thead th:last-child,
  .bcgw-acuity-table tbody td:last-child {
    padding-right: 16px;
  }

  /* uniform row color */
  .bcgw-acuity-table tbody tr { background: #FFFFFF; }

  /* black separators betwen rows */
  .bcgw-acuity-table tbody tr + tr td {
    border-top: 1px solid #000000;
  }
`}</style>
    </>
  );
}
