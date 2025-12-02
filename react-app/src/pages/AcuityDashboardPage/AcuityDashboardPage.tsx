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
import { toPng } from "html-to-image";
import download from "downloadjs";
import {
  DateRangePicker,
  defaultPresets,
  defaultDateRange,
  DateRange,
} from "@/components/DateRangePicker/DateRangePicker";
import { DataTable } from "@/components/DataTable/DataTable";
import {
  TrimesterAttendance,
  trimesterColumns,
  InstructorAttendance,
  instructorColumns,
} from "./AcuityTableColumns";
import InstructorPopup from "./InstructorPopup";
import SelectDropdown from "@/components/SelectDropdown";
import { Button } from "@/components/ui/button";
import { useAcuityApptsInRange } from "@/hooks/queries/useAcuityApptsInRange";
import { DateTime } from "luxon";

export default function AcuityDashboardPage() {
  // const [allClasses, setAllClasses] = useState<any[]>([]);
  const [attendanceDisplay, setAttendanceDisplay] = useState<string>("graph");
  const [popularityDisplay, setPopularityDisplay] = useState<string>("graph");
  const attendanceChartRef = useRef<HTMLDivElement>(null);
  const classPopularityChartRef = useRef<HTMLDivElement>(null);
  const [openInstructorRow, setOpenInstructorRow] =
    useState<InstructorAttendance | null>(null);

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
  const trimesters = [
    "FIRST TRIM",
    "SECOND TRIM",
    "THIRD TRIM",
    "FOURTH TRIM",
    "FIFTH TRIM",
  ];
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );

  const {
    data: appointmentData,
    isPending: isApptDataPending,
    error: apptError,
  } = useAcuityApptsInRange(
    dateRange?.from?.toISOString(),
    dateRange?.to?.toISOString(),
    selectedTrimesterClass,
  );
  console.log(appointmentData);

  const trimesterAttendance: Map<string, number> = new Map();
  const classesToCategory: Map<string, string> = new Map();
  if (appointmentData) {
    for (const appt of appointmentData) {
      if (appt.class && appt.classCategory) {
        classesToCategory.set(appt.class, appt.classCategory);
      }

      // skip babies with no due dates
      if (appt.babyDueDatesISO.length === 0) {
        continue;
      }
      const apptTime = DateTime.fromISO(appt.datetime);
      // get date that is closest to the appt date
      let timeDiff = DateTime.fromISO(appt.babyDueDatesISO[0]).diff(
        apptTime,
        "weeks",
      ).weeks;
      // set chosen baby date as first in array
      let chosenDate = DateTime.fromISO(appt.babyDueDatesISO[0]);
      // if there are multiple dates in the array, check for each
      for (let i = 1; i < appt.babyDueDatesISO.length; i++) {
        // get difference between curr date and appt time
        const currDiff = DateTime.fromISO(appt.babyDueDatesISO[i]).diff(
          apptTime,
          "weeks",
        ).weeks;
        // if the time difference is less than the curr min, update
        chosenDate =
          currDiff < timeDiff
            ? DateTime.fromISO(appt.babyDueDatesISO[i])
            : chosenDate;
        timeDiff = Math.min(timeDiff, currDiff);
      }

      // calculate trimester
      // if the date has already passed, assume that it's a birth date
      if (chosenDate < apptTime) {
        const diff = apptTime.diff(chosenDate, "weeks").weeks;
        // first three months is fourth trimester
        if (diff <= 12) {
          trimesterAttendance.set(
            `${appt.classCategory?.toLowerCase()} FOURTH TRIM`,
            trimesterAttendance.has(
              `${appt.classCategory?.toLowerCase()} FOURTH TRIM`,
            )
              ? trimesterAttendance.get(
                  `${appt.classCategory?.toLowerCase()} FOURTH TRIM`,
                )! + 1
              : 1,
          );
          trimesterAttendance.set(
            `${appt.class?.toLowerCase()} FOURTH TRIM`,
            trimesterAttendance.has(`${appt.class?.toLowerCase()} FOURTH TRIM`)
              ? trimesterAttendance.get(
                  `${appt.class?.toLowerCase()} FOURTH TRIM`,
                )! + 1
              : 1,
          );
        } else {
          trimesterAttendance.set(
            `${appt.classCategory?.toLowerCase()} FIFTH TRIM`,
            trimesterAttendance.has(
              `${appt.classCategory?.toLowerCase()} FIFTH TRIM`,
            )
              ? trimesterAttendance.get(
                  `${appt.classCategory?.toLowerCase()} FIFTH TRIM`,
                )! + 1
              : 1,
          );
          trimesterAttendance.set(
            `${appt.class?.toLowerCase()} FIFTH TRIM`,
            trimesterAttendance.has(`${appt.class?.toLowerCase()} FIFTH TRIM`)
              ? trimesterAttendance.get(
                  `${appt.class?.toLowerCase()} FIFTH TRIM`,
                )! + 1
              : 1,
          );
        }
      } else {
        // if not, it is a due date
        // pregnancy typically 40 weeks, find "start" of pregnancy
        const pregnancyStart = chosenDate.minus({ weeks: 40 });
        // subtract start date from due date and round
        const weeksIntoPregnancy = Math.floor(
          apptTime.diff(pregnancyStart, "weeks").weeks,
        );
        if (weeksIntoPregnancy >= 29) {
          trimesterAttendance.set(
            `${appt.classCategory?.toLowerCase()} THIRD TRIM`,
            trimesterAttendance.has(
              `${appt.classCategory?.toLowerCase()} THIRD TRIM`,
            )
              ? trimesterAttendance.get(
                  `${appt.classCategory?.toLowerCase()} THIRD TRIM`,
                )! + 1
              : 1,
          );
          trimesterAttendance.set(
            `${appt.class?.toLowerCase()} THIRD TRIM`,
            trimesterAttendance.has(`${appt.class?.toLowerCase()} THIRD TRIM`)
              ? trimesterAttendance.get(
                  `${appt.class?.toLowerCase()} THIRD TRIM`,
                )! + 1
              : 1,
          );
        } else if (weeksIntoPregnancy >= 15) {
          // 15-18 is second
          trimesterAttendance.set(
            `${appt.classCategory?.toLowerCase()} SECOND TRIM`,
            trimesterAttendance.has(
              `${appt.classCategory?.toLowerCase()} SECOND TRIM`,
            )
              ? trimesterAttendance.get(
                  `${appt.classCategory?.toLowerCase()} SECOND TRIM`,
                )! + 1
              : 1,
          );
          trimesterAttendance.set(
            `${appt.class?.toLowerCase()} SECOND TRIM`,
            trimesterAttendance.has(`${appt.class?.toLowerCase()} SECOND TRIM`)
              ? trimesterAttendance.get(
                  `${appt.class?.toLowerCase()} SECOND TRIM`,
                )! + 1
              : 1,
          );
        } else {
          trimesterAttendance.set(
            `${appt.classCategory?.toLowerCase()} FIRST TRIM`,
            trimesterAttendance.has(
              `${appt.classCategory?.toLowerCase()} FIRST TRIM`,
            )
              ? trimesterAttendance.get(
                  `${appt.classCategory?.toLowerCase()} FIRST TRIM`,
                )! + 1
              : 1,
          );
          trimesterAttendance.set(
            `${appt.class?.toLowerCase()} FIRST TRIM`,
            trimesterAttendance.has(`${appt.class?.toLowerCase()} FIRST TRIM`)
              ? trimesterAttendance.get(
                  `${appt.class?.toLowerCase()} FIRST TRIM`,
                )! + 1
              : 1,
          );
        }
      }
    }
  }
  console.log(trimesterAttendance);

  // for each category, for each trimester, look up totals from map
  const trimesterAttendanceData = classFilterOptions.map((category) => {
    const categoryLower = category.toLowerCase();

    return {
      key: category,
      data: trimesters.map((trimester) => ({
        key: trimester,
        data: trimesterAttendance.get(`${categoryLower} ${trimester}`) ?? 0,
      })),
    };
  });

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

  const allClassAttendanceData = classFilterOptions.map((category) => {
    return {
      key: category,
      // for each class of the category, get totals
      data: Array.from(classesToCategory.entries()).map(([className]) => {
        const classKey = className.toLowerCase();

        const first = trimesterAttendance.get(`${classKey} FIRST TRIM`) ?? 0;
        const second = trimesterAttendance.get(`${classKey} SECOND TRIM`) ?? 0;
        const third = trimesterAttendance.get(`${classKey} THIRD TRIM`) ?? 0;
        const fourth = trimesterAttendance.get(`${classKey} FOURTH TRIM`) ?? 0;
        const fifth = trimesterAttendance.get(`${classKey} FIFTH TRIM`) ?? 0;

        const total = first + second + third + fourth + fifth;

        return {
          key: className,
          data: total,
        };
      }),
    };
  });

  const trimesterData: TrimesterAttendance[] = Array.from(
    classesToCategory.entries(),
  ).map(([className, category]) => {
    const classKey = className.toLowerCase();

    const first = trimesterAttendance.get(`${classKey} FIRST TRIM`) ?? 0;
    const second = trimesterAttendance.get(`${classKey} SECOND TRIM`) ?? 0;
    const third = trimesterAttendance.get(`${classKey} THIRD TRIM`) ?? 0;
    const fourth = trimesterAttendance.get(`${classKey} FOURTH TRIM`) ?? 0;
    const fifth = trimesterAttendance.get(`${classKey} FIFTH TRIM`) ?? 0;

    const total = first + second + third + fourth + fifth;

    return {
      class: className.slice(0, 15) + "...",
      category,
      first,
      second,
      third,
      fourth,
      fifth,
      total,
    };
  });

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

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
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
              onChange={(range) => setDateRange(range)}
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
          {dateRange?.from && dateRange?.to
            ? formatDate(dateRange.from) + " - " + formatDate(dateRange.to)
            : "All Data"}
          {attendanceDisplay === "graph" ? <br /> : <></>}
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
              columns={instructorColumns((row) => setOpenInstructorRow(row))}
              data={instructorData}
              tableType="default"
              tableHeaderExtras={classPopularityTableExtras}
              pageSize={5}
            />
          )}
        </div>
      </div>
      <InstructorPopup
        openRow={openInstructorRow}
        setOpenRow={setOpenInstructorRow}
      />
    </>
  );
}
