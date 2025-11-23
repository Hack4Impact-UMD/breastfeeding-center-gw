import { useState, useRef } from "react";
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
import SelectDropdown from "@/components/SelectDropdown";
import { Button } from "@/components/ui/button";

export default function AcuityDashboardPage() {
  // const [allClasses, setAllClasses] = useState<any[]>([]);
  const [attendanceDisplay, setAttendanceDisplay] = useState<string>("graph");
  const [popularityDisplay, setPopularityDisplay] = useState<string>("graph");
  const attendanceChartRef = useRef<HTMLDivElement>(null);
  const classPopularityChartRef = useRef<HTMLDivElement>(null);
  const [, setOpenRow] = useState<InstructorAttendance | null>(null);

  const chartDiv =
    "flex flex-col items-center justify-start bg-white min-h-[400px] border-2 border-black p-5 mt-5 rounded-2xl";

  // ── CLASS dropdown state & data ───────────────────────────────
  const [selectedTrimesterClass, setSelectedTrimesterClass] =
    useState("ALL CLASSES");
  const [selectedPopularityClass, setSelectedPopularityClass] =
    useState("ALL CLASSES");

  const classFilterOptions = [
    "ALL CLASSES",
    "POSTPARTUM CLASSES",
    "PRENATAL CLASSES",
    "INFANT MASSAGE",
    "PARENT GROUPS",
    "CHILDBIRTH CLASSES",
  ];
  const trimesterAttendanceData = [
    {
      key: "POSTPARTUM CLASSES",
      data: [
        { key: "FIRST TRIM", data: 10 },
        { key: "SECOND TRIM", data: 15 },
        { key: "THIRD TRIM", data: 20 },
        { key: "FOURTH TRIM", data: 5 },
        { key: "FIFTH TRIM", data: 5 },
      ],
    },
    {
      key: "PRENATAL CLASSES",
      data: [
        { key: "FIRST TRIM", data: 7 },
        { key: "SECOND TRIM", data: 1 },
        { key: "THIRD TRIM", data: 2 },
        { key: "FOURTH TRIM", data: 10 },
        { key: "FIFTH TRIM", data: 3 },
      ],
    },
    {
      key: "INFANT MASSAGE",
      data: [
        { key: "FIRST TRIM", data: 1 },
        { key: "SECOND TRIM", data: 4 },
        { key: "THIRD TRIM", data: 3 },
        { key: "FOURTH TRIM", data: 7 },
        { key: "FIFTH TRIM", data: 10 },
      ],
    },
    {
      key: "PARENT GROUPS",
      data: [
        { key: "FIRST TRIM", data: 9 },
        { key: "SECOND TRIM", data: 6 },
        { key: "THIRD TRIM", data: 19 },
        { key: "FOURTH TRIM", data: 4 },
        { key: "FIFTH TRIM", data: 7 },
      ],
    },
    {
      key: "CHILDBIRTH CLASSES",
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
      key: "POSTPARTUM CLASSES",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 30 },
        { key: new Date("2025-03-12"), data: 25 },
        { key: new Date("2025-03-19"), data: 15 },
      ],
    },
    {
      key: "PRENATAL CLASSES",
      data: [
        { key: new Date("2025-02-19"), data: 8 },
        { key: new Date("2025-02-26"), data: 15 },
        { key: new Date("2025-03-05"), data: 22 },
        { key: new Date("2025-03-12"), data: 18 },
        { key: new Date("2025-03-19"), data: 12 },
      ],
    },
    {
      key: "INFANT MASSAGE",
      data: [
        { key: new Date("2025-02-19"), data: 1 },
        { key: new Date("2025-02-26"), data: 2 },
        { key: new Date("2025-03-05"), data: 3 },
        { key: new Date("2025-03-12"), data: 4 },
        { key: new Date("2025-03-19"), data: 5 },
      ],
    },
    {
      key: "PARENT GROUPS",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 7 },
        { key: new Date("2025-03-12"), data: 9 },
        { key: new Date("2025-03-19"), data: 2 },
      ],
    },
    {
      key: "CHILDBIRTH CLASSES",
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
      key: "POSTPARTUM CLASSES",
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
      key: "PRENATAL CLASSES",
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
      key: "INFANT MASSAGE",
      data: [{ key: "INFANT MASSAGE", data: 7 }],
    },
    {
      key: "PARENT GROUPS",
      data: [
        { key: "Navigating Perinatal Stress", data: 7 },
        { key: "Feeding + Postpartum with 0-4m Olds", data: 9 },
        { key: "Feeding + Postpartum with 4-12m Olds", data: 14 },
        { key: "Feeding + Postpartum with Toddlers", data: 5 },
      ],
    },
    {
      key: "CHILDBIRTH CLASSES",
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
      avgAttendance: 30,
      numClasses: 11,
      totalAttendance: 11,
      instructorNames: "Jane Doe, John Smith",
      instructors: [
        {
          instructor: "Jane Doe",
          avgAttendance: 15,
          numClasses: 6,
          totalAttendance: 90,
        },
        {
          instructor: "John Smith",
          avgAttendance: 15,
          numClasses: 5,
          totalAttendance: 75,
        },
      ],
    },
    {
      class: "Baby Care",
      category: "Prenatal",
      avgAttendance: 15,
      numClasses: 7,
      totalAttendance: 7,
      instructorNames: "Emily Davis",
      instructors: [
        {
          instructor: "Emily Davis",
          avgAttendance: 15,
          numClasses: 7,
          totalAttendance: 105,
        },
      ],
    },
    {
      class: "Postpartum...",
      category: "Postpartum",
      avgAttendance: 32,
      numClasses: 17,
      totalAttendance: 10,
      instructorNames: "Michael Brown",
      instructors: [
        {
          instructor: "Michael Brown",
          avgAttendance: 32,
          numClasses: 17,
          totalAttendance: 544,
        },
      ],
    },
    {
      class: "Bottle & O...",
      category: "Postpartum",
      avgAttendance: 22,
      numClasses: 1,
      totalAttendance: 19,
      instructorNames: "Sarah Lee",
      instructors: [
        {
          instructor: "Sarah Lee",
          avgAttendance: 22,
          numClasses: 1,
          totalAttendance: 22,
        },
      ],
    },
    {
      class: "Starting S...",
      category: "Postpartum",
      avgAttendance: 32,
      numClasses: 13,
      totalAttendance: 15,
      instructorNames: "David Wilson",
      instructors: [
        {
          instructor: "David Wilson",
          avgAttendance: 32,
          numClasses: 13,
          totalAttendance: 416,
        },
      ],
    },
  ];

  // Styles
  const centerItemsInDiv = "flex justify-between items-center";
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
    selectedPopularityClass === "ALL CLASSES"
      ? allClassData
      : allClassData.filter((item) => item.key === selectedPopularityClass);

  const filteredClassBars =
    selectedTrimesterClass === "ALL CLASSES"
      ? []
      : allClassAttendanceData.filter((c) => c.key === selectedTrimesterClass);

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

  const allInstructorData = [
    {
      key: "POSTPARTUM CLASSES",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 30 },
        { key: new Date("2025-03-12"), data: 25 },
        { key: new Date("2025-03-19"), data: 15 },
      ],
    },
    {
      key: "PRENATAL CLASSES",
      data: [
        { key: new Date("2025-02-19"), data: 8 },
        { key: new Date("2025-02-26"), data: 15 },
        { key: new Date("2025-03-05"), data: 22 },
        { key: new Date("2025-03-12"), data: 18 },
        { key: new Date("2025-03-19"), data: 12 },
      ],
    },
    {
      key: "INFANT MASSAGE",
      data: [
        { key: new Date("2025-02-19"), data: 1 },
        { key: new Date("2025-02-26"), data: 2 },
        { key: new Date("2025-03-05"), data: 3 },
        { key: new Date("2025-03-12"), data: 4 },
        { key: new Date("2025-03-19"), data: 5 },
      ],
    },
    {
      key: "PARENT GROUPS",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 7 },
        { key: new Date("2025-03-12"), data: 9 },
        { key: new Date("2025-03-19"), data: 2 },
      ],
    },
    {
      key: "CHILDBIRTH CLASSES",
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
    selectedPopularityClass === "ALL CLASSES"
      ? allInstructorData
      : allInstructorData.filter(
          (item) => item.key === selectedPopularityClass,
        );

  const classAttendanceTableExtras = (
    <div className="w-full flex justify-end">
      <SelectDropdown
        options={classFilterOptions}
        selected={selectedTrimesterClass}
        onChange={setSelectedTrimesterClass}
      />
    </div>
  );

  const classPopularityTableExtras = (
    <div className="w-full flex justify-end">
      <SelectDropdown
        options={classFilterOptions}
        selected={selectedPopularityClass}
        onChange={setSelectedPopularityClass}
      />
    </div>
  );

  return (
    <>
      <div className="flex flex-col py-14 px-10 sm:px-20 space-y-5">
        <div className={centerItemsInDiv}>
          <div>
            <h1 className="font-bold text-4xl lg:text-5xl">ACUITY</h1>
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
          <Button
            variant={"outlineGray"}
            className={
              "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
            }
            onClick={() => handleExport(attendanceChartRef, "class_attendance")}
          >
            Export
          </Button>
        </div>
        {/* Attendance by Trimester Bar Chart */}
        <span className="self-start font-semibold text-2xl">
          Class Attendance By Trimester,{" "}
          {attendanceDisplay === "graph" ? <br /> : <></>}2/19/25 - 3/19/25
        </span>
        {attendanceDisplay === "graph" ? (
          <div className={chartDiv} ref={attendanceChartRef}>
            {/* Class dropdown */}
            <div className="self-end mb-4">
              <SelectDropdown
                options={classFilterOptions}
                selected={selectedTrimesterClass}
                onChange={setSelectedTrimesterClass}
              />
            </div>

            <div className="w-full h-96">
              {selectedTrimesterClass === "ALL CLASSES" ? (
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
          </div>
        ) : (
          <DataTable
            columns={trimesterColumns}
            data={trimesterData}
            tableType="default"
            tableHeaderExtras={classAttendanceTableExtras}
            pageSize={5}
          />
        )}
        <div className={`${centerItemsInDiv} pt-8`}>
          <div className="flex flex-row">
            <button
              className={`${graphTableButtonStyle} ${
                popularityDisplay == "graph"
                  ? "bg-bcgw-gray-light"
                  : "bg-[#f5f5f5]"
              }`}
              onClick={() => setPopularityDisplay("graph")}
            >
              Graph
            </button>
            <button
              className={`${graphTableButtonStyle} ${
                popularityDisplay == "table"
                  ? "bg-bcgw-gray-light"
                  : "bg-[#f5f5f5]"
              }`}
              onClick={() => setPopularityDisplay("table")}
            >
              Table
            </button>
          </div>
          <Button
            variant={"outlineGray"}
            className={
              "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
            }
            onClick={() =>
              handleExport(classPopularityChartRef, "class_popularity")
            }
          >
            Export
          </Button>
        </div>
        <span className="self-start font-semibold text-2xl">
          {popularityDisplay === "graph" ? (
            <span>Class and Instructor Popularity Over Time</span>
          ) : (
            <span>Attendance By Class & Instructor</span>
          )}
          {popularityDisplay === "graph" ? <br /> : <></>} 2/19/25 - 3/19/25
        </span>
        {/* Class Popularity Over Time */}
        <div ref={classPopularityChartRef}>
          {popularityDisplay === "graph" ? (
            <>
              <div className="text-2xl font-semibold">Class Popularity</div>
              {/* Class dropdown */}
              <div className={chartDiv}>
                <div className="self-end mb-4">
                  <SelectDropdown
                    options={classFilterOptions}
                    selected={selectedPopularityClass}
                    onChange={setSelectedPopularityClass}
                  />
                </div>
                <div className="w-full h-96">
                  <LineChart
                    height={300}
                    data={filteredClassData}
                    series={<LineSeries type="grouped" />}
                  />
                </div>
              </div>

              <div className="mt-8 text-2xl font-semibold">
                Instructor Popularity
              </div>
              <div className={chartDiv}>
                <div className="self-end mb-4">
                  <SelectDropdown
                    options={classFilterOptions}
                    selected={selectedPopularityClass}
                    onChange={setSelectedPopularityClass}
                  />
                </div>
                <div className="w-full h-96">
                  <LineChart
                    height={300}
                    data={filteredInstructorData}
                    series={<LineSeries type="grouped" />}
                  />
                </div>
              </div>
            </>
          ) : (
            <DataTable
              columns={instructorColumns((row) => setOpenRow(row))}
              data={instructorData}
              tableType="default"
              tableHeaderExtras={classPopularityTableExtras}
              pageSize={5}
            />
          )}
        </div>
      </div>
    </>
  );
}
