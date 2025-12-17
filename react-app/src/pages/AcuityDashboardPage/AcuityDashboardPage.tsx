import { useState, useMemo } from "react";
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
  BarLabel,
  DiscreteLegend,
  DiscreteLegendEntry,
  schemes,
} from "reaviz";
import { Export } from "@/components/export/Export";
import ExportTrigger from "@/components/export/ExportTrigger";
import ExportContent from "@/components/export/ExportContent";
import ExportOnly from "@/components/export/ExportOnly";
import { formatDate } from "@/lib/utils";
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
import { AcuityAppointment } from "@/types/AcuityType";
import Loading from "@/components/Loading";

function computeAttendanceByInterval(
  filteredAppointmentsForPopularity: AcuityAppointment[],
  shouldGroupByWeek: boolean,
) {
  const classAttendanceByInterval = new Map<string, Map<string, number>>();
  const instructorAttendanceByInterval = new Map<string, Map<string, number>>();
  const instructorDataByClass = new Map<
    string,
    Map<
      string,
      {
        count: number;
        uniqueSessions: Set<string>;
        classCategory: string;
      }
    >
  >();

  for (const appt of filteredAppointmentsForPopularity) {
    if (!appt.datetime) continue;

    const apptDate = DateTime.fromISO(appt.datetime);
    if (!apptDate.isValid) continue;

    const intervalKey = getIntervalKey(apptDate, shouldGroupByWeek);
    const classCategory = normalizeCategory(appt.classCategory) || "UNKNOWN";
    const className = appt.class || "UNKNOWN";
    const instructor = appt.instructor || "UNKNOWN";

    if (!classAttendanceByInterval.has(intervalKey)) {
      classAttendanceByInterval.set(intervalKey, new Map<string, number>());
    }
    const classMap = classAttendanceByInterval.get(intervalKey)!;
    classMap.set(classCategory, (classMap.get(classCategory) || 0) + 1);

    if (!instructorAttendanceByInterval.has(intervalKey)) {
      instructorAttendanceByInterval.set(
        intervalKey,
        new Map<string, number>(),
      );
    }
    const instructorMap = instructorAttendanceByInterval.get(intervalKey)!;
    instructorMap.set(instructor, (instructorMap.get(instructor) || 0) + 1);

    if (!instructorDataByClass.has(className)) {
      instructorDataByClass.set(className, new Map());
    }
    const classInstructorMap = instructorDataByClass.get(className)!;
    if (!classInstructorMap.has(instructor)) {
      classInstructorMap.set(instructor, {
        count: 0,
        uniqueSessions: new Set<string>(),
        classCategory: classCategory,
      });
    }
    const instructorStats = classInstructorMap.get(instructor)!;
    instructorStats.count += 1;
    const sessionKey = `${appt.datetime}`;
    instructorStats.uniqueSessions.add(sessionKey);
  }

  return {
    classAttendanceByInterval,
    instructorAttendanceByInterval,
    instructorDataByClass,
  };
}

const normalizeCategory = (category: string | null | undefined): string => {
  if (!category) return "";
  return category.toUpperCase().trim();
};

const getIntervalKey = (date: DateTime, shouldGroupByWeek: boolean): string => {
  if (shouldGroupByWeek) {
    const weekStart = date.startOf("week");
    return weekStart.toISODate() || "";
  } else {
    return date.toFormat("yyyy-MM");
  }
};

export default function AcuityDashboardPage() {
  const [attendanceDisplay, setAttendanceDisplay] = useState<string>("graph");
  const [popularityDisplay, setPopularityDisplay] = useState<string>("graph");
  const [openInstructorRow, setOpenInstructorRow] =
    useState<InstructorAttendance | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );

  const chartDiv =
    "flex flex-col items-center justify-start bg-white min-h-[400px] border-2 border-black p-5 mt-5 rounded-2xl";

  // ── CLASS dropdown state & data ───────────────────────────────
  const [selectedClassCategory, setSelectedClassCategory] =
    useState("ALL CLASSES");

  const classFilterOptions = useMemo(
    () => [
      "ALL CLASSES",
      "POSTPARTUM CLASSES",
      "PRENATAL CLASSES",
      "INFANT MASSAGE",
      "PARENT GROUPS",
      "CHILDBIRTH CLASSES",
    ],
    [],
  );

  const trimesterLegend = [
    { key: "FIRST TRIM", color: "#FCD484" },
    { key: "SECOND TRIM", color: "#FFAA00" },
    { key: "THIRD TRIM", color: "#5DB9FF" },
    { key: "FOURTH TRIM", color: "#1661A9" },
    { key: "FIFTH TRIM", color: "#05182A" },
  ];

  const classColorScheme: Record<string, string> = {
    "POSTPARTUM CLASSES": schemes.cybertron[0],
    "PRENATAL CLASSES": schemes.cybertron[1],
    "INFANT MASSAGE": schemes.cybertron[2],
    "PARENT GROUPS": schemes.cybertron[3],
    "CHILDBIRTH CLASSES": schemes.cybertron[4],
  };

  const dateRangeLabel =
    dateRange?.from && dateRange?.to
      ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
      : "All Data";

  const {
    data: appointmentData,
    isPending: isApptDataPending,
    error: apptError,
  } = useAcuityApptsInRange(
    dateRange?.from?.toISOString(),
    dateRange?.to?.toISOString(),
    selectedClassCategory,
  );

  //NOTE: acuity appts are already filtered from the api response
  const filteredAppointmentsForTrimester = useMemo(() => appointmentData ?? [], [appointmentData]);
  const filteredAppointmentsForPopularity = useMemo(() => appointmentData ?? [], [appointmentData]);

  const [trimesterAttendance, classesToCategory] = useMemo(() => {
    const trimesterAttendance: Map<string, number> = new Map();
    const classesToCategory: Map<string, string> = new Map();
    if (filteredAppointmentsForTrimester) {
      for (const appt of filteredAppointmentsForTrimester) {
        if (appt.class && appt.classCategory) {
          classesToCategory.set(appt.class, appt.classCategory);
        }

        // skip babies with no due dates
        if (appt.babyDueDatesISO.length === 0) {
          continue;
        }
        const apptTime = DateTime.fromISO(appt.datetime);
        // get date that is closest to the appt date
        let timeDiff = Math.abs(
          DateTime.fromISO(appt.babyDueDatesISO[0]).diff(apptTime, "weeks")
            .weeks,
        );
        // set chosen baby date as first in array
        let chosenDate = DateTime.fromISO(appt.babyDueDatesISO[0]);
        // if there are multiple dates in the array, check for each
        for (let i = 1; i < appt.babyDueDatesISO.length; i++) {
          // get difference between curr date and appt time
          const currDiff = Math.abs(
            DateTime.fromISO(appt.babyDueDatesISO[i]).diff(apptTime, "weeks")
              .weeks,
          );
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
              trimesterAttendance.has(
                `${appt.class?.toLowerCase()} FOURTH TRIM`,
              )
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
              trimesterAttendance.has(
                `${appt.class?.toLowerCase()} SECOND TRIM`,
              )
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
    return [trimesterAttendance, classesToCategory];
  }, [filteredAppointmentsForTrimester]);

  const shouldGroupByWeek = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const from = DateTime.fromJSDate(dateRange.from);
    const to = DateTime.fromJSDate(dateRange.to);
    const diffInMonths = to.diff(from, "months").months;
    return diffInMonths <= 3;
  }, [dateRange]);

  const {
    classAttendanceByInterval,
    instructorAttendanceByInterval,
    instructorDataByClass,
  } = useMemo(
    () =>
      computeAttendanceByInterval(
        filteredAppointmentsForPopularity,
        shouldGroupByWeek,
      ),
    [filteredAppointmentsForPopularity, shouldGroupByWeek],
  );

  const groupedData = useMemo(() => {
    if (
      !filteredAppointmentsForPopularity ||
      filteredAppointmentsForPopularity.length === 0
    ) {
      return {
        classData: [],
        instructorData: [],
        instructorTableData: [],
      };
    }

    const allIntervals = Array.from(classAttendanceByInterval.keys()).sort();
    const classData = classFilterOptions
      .filter((cat) => cat !== "ALL CLASSES")
      .map((category) => {
        const normalizedCategory = normalizeCategory(category);
        return {
          key: category,
          data: allIntervals.map((intervalKey) => {
            const date = shouldGroupByWeek
              ? DateTime.fromISO(intervalKey).toJSDate()
              : DateTime.fromFormat(intervalKey, "yyyy-MM")
                .startOf("month")
                .toJSDate();
            const count =
              classAttendanceByInterval
                .get(intervalKey)
                ?.get(normalizedCategory) || 0;
            return { key: date, data: count };
          }),
        };
      });

    //TODO: Fix this somehow
    const instructorData = classFilterOptions.map((category) => {
      const normalizedCategory = normalizeCategory(category);
      return {
        key: category,
        data: allIntervals.map((intervalKey) => {
          const date = shouldGroupByWeek
            ? DateTime.fromISO(intervalKey).toJSDate()
            : DateTime.fromFormat(intervalKey, "yyyy-MM")
              .startOf("month")
              .toJSDate();
          const count =
            instructorAttendanceByInterval
              .get(intervalKey)
              ?.get(normalizedCategory) || 0;
          return { key: date, data: count };
        }),
      };
    });

    const instructorTableData: InstructorAttendance[] = Array.from(
      instructorDataByClass.entries(),
    ).map(([className, instructorMap]) => {
      const firstInstructor = Array.from(instructorMap.values())[0];
      const classCategory = firstInstructor?.classCategory || "UNKNOWN";

      const instructors: Array<{
        instructor: string;
        avgAttendance: number;
        numClasses: number;
        totalAttendance: number;
      }> = Array.from(instructorMap.entries()).map(([instructor, stats]) => {
        const numClasses = stats.uniqueSessions.size;
        const avgAttendance = numClasses > 0 ? stats.count / numClasses : 0;
        return {
          instructor,
          avgAttendance: Math.round(avgAttendance * 100) / 100,
          numClasses,
          totalAttendance: stats.count,
        };
      });

      const totalAttendance = instructors.reduce(
        (sum, inst) => sum + inst.totalAttendance,
        0,
      );
      const totalClasses = instructors.reduce(
        (sum, inst) => sum + inst.numClasses,
        0,
      );
      const avgAttendance =
        totalClasses > 0 ? totalAttendance / totalClasses : 0;

      return {
        class:
          className.length > 15 ? className.slice(0, 15) + "..." : className,
        category: classCategory,
        avgAttendance: Math.round(avgAttendance * 100) / 100,
        numClasses: totalClasses,
        totalAttendance,
        instructorNames: instructors.map((i) => i.instructor).join(", "),
        instructors,
      };
    });

    return {
      classData,
      instructorData,
      instructorTableData,
    };
  }, [
    filteredAppointmentsForPopularity,
    classAttendanceByInterval,
    classFilterOptions,
    instructorDataByClass,
    shouldGroupByWeek,
    instructorAttendanceByInterval,
  ]);

  const trimesterAttendanceData = classFilterOptions
    .filter(cat => cat !== "ALL CLASSES")
    .map((category) => {
      const categoryLower = category.toLowerCase();

      return {
        key: category,
        data: trimesterLegend.map((trimester) => ({
          key: trimester.key,
          data: trimesterAttendance.get(`${categoryLower} ${trimester.key}`) ?? 0,
        })),
      };
    });

  const allClassData = groupedData.classData;

  const allClassAttendanceData = classFilterOptions.map((category) => {
    return {
      key: category,
      data: Array.from(classesToCategory.entries()).map(([className]) => {
        const classKey = className.toLowerCase();

        // const first = trimesterAttendance.get(`${classKey} FIRST TRIM`) ?? 0;
        // const second = trimesterAttendance.get(`${classKey} SECOND TRIM`) ?? 0;
        // const third = trimesterAttendance.get(`${classKey} THIRD TRIM`) ?? 0;
        // const fourth = trimesterAttendance.get(`${classKey} FOURTH TRIM`) ?? 0;
        // const fifth = trimesterAttendance.get(`${classKey} FIFTH TRIM`) ?? 0;
        //
        // const total = first + second + third + fourth + fifth;

        return {
          key: className,
          data: trimesterLegend.map((trimester) => ({
            key: trimester.key,
            data: trimesterAttendance.get(`${classKey} ${trimester.key}`) ?? 0,
          })),
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

  const instructorData: InstructorAttendance[] = useMemo(() => {
    const data = groupedData.instructorTableData;
    if (selectedClassCategory === "ALL CLASSES") return data;
    const selectedCategory = normalizeCategory(selectedClassCategory);
    return data.filter(
      (item) => normalizeCategory(item.category) === selectedCategory,
    );
  }, [groupedData.instructorTableData, selectedClassCategory]);

  // Styles
  const centerItemsInDiv = "flex justify-between items-center";
  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer";

  // Filter class data based on selection
  const filteredClassData =
    selectedClassCategory === "ALL CLASSES"
      ? allClassData
      : allClassData.filter((item) => item.key === selectedClassCategory);

  const filteredClassBars =
    selectedClassCategory === "ALL CLASSES"
      ? []
      : allClassAttendanceData.filter((c) => c.key === selectedClassCategory);

  const barData = filteredClassBars[0]?.data ?? [];
  const allInstructorData = groupedData.instructorData;

  const filteredInstructorData =
    selectedClassCategory === "ALL CLASSES"
      ? allInstructorData
      : allInstructorData.filter(
        (item) => item.key === selectedClassCategory,
      );

  const classAttendanceTableExtras = (
    <div className="w-full flex justify-end p-2">
      <SelectDropdown
        options={classFilterOptions}
        selected={selectedClassCategory}
        onChange={setSelectedClassCategory}
      />
    </div>
  );

  const classPopularityTableExtras = (
    <div className="w-full flex justify-end">
      <SelectDropdown
        options={classFilterOptions}
        selected={selectedClassCategory}
        onChange={setSelectedClassCategory}
      />
    </div>
  );
  return (
    <>
      <div className="flex flex-col h-full py-14 px-10 sm:px-20 space-y-5">
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

        {isApptDataPending ? (
          <div className="grow flex items-center justify-center">
            <Loading />
          </div>
        ) : apptError ? (
          <div className="grow flex items-center justify-center">
            <p className="text-center">Failed to fetch Acuity data: {apptError.message}</p>
          </div>
        ) : (
          <>
            <Export title={`ClassAttendanceByTrimester${dateRangeLabel}`}>
              <div className={`${centerItemsInDiv} pt-4`}>
                <div className="flex flex-row">
                  <button
                    className={`${graphTableButtonStyle} ${attendanceDisplay == "graph"
                      ? "bg-bcgw-gray-light"
                      : "bg-[#f5f5f5]"
                      }`}
                    onClick={() => setAttendanceDisplay("graph")}
                  >
                    Graph
                  </button>
                  <button
                    className={`${graphTableButtonStyle} ${attendanceDisplay == "table"
                      ? "bg-bcgw-gray-light"
                      : "bg-[#f5f5f5]"
                      }`}
                    onClick={() => setAttendanceDisplay("table")}
                  >
                    Table
                  </button>
                </div>
                <ExportTrigger disabled={attendanceDisplay !== "graph"} asChild>
                  <Button
                    variant={"outlineGray"}
                    className={
                      "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
                    }
                  >
                    Export
                  </Button>
                </ExportTrigger>
              </div>
              {/* Attendance by Trimester Bar Chart */}
              <span className="self-start font-semibold text-2xl">
                Class Attendance By Trimester,{" "}
                {attendanceDisplay === "graph" ? <br /> : <></>}
                {dateRangeLabel}
              </span>
              {attendanceDisplay === "graph" ? (
                <div className={chartDiv}>
                  {/* Class dropdown */}
                  <div className="self-end mb-4">
                    <SelectDropdown
                      options={classFilterOptions}
                      selected={selectedClassCategory}
                      onChange={setSelectedClassCategory}
                    />
                  </div>

                  <ExportContent className="w-full h-96">
                    <ExportOnly className="mb-5">
                      <h1 className="text-xl font-bold text-black">
                        Class Attendance By Trimester
                      </h1>
                      <p className="text-base text-black">{dateRangeLabel}</p>
                      <p className="text-gray-800 text-sm">
                        {selectedClassCategory}
                      </p>
                    </ExportOnly>
                    {selectedClassCategory === "ALL CLASSES" ? (
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
                                label={
                                  <BarLabel
                                    position="center"
                                    fill="white"
                                    scale={20}
                                    className="z-20"
                                  />
                                }
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
                            colorScheme={trimesterLegend.map((i) => i.color)}
                          />
                        }
                      />
                    ) : (
                      /* single-series bar chart for one class: */
                      <StackedBarChart
                        height={350}
                        data={barData}
                        series={
                          <StackedBarSeries
                            colorScheme={trimesterLegend.map((i) => i.color)}
                            padding={0.1}
                            bar={
                              <Bar
                                label={
                                  <BarLabel
                                    position="center"
                                    fill="white"
                                    scale={20}
                                    className="z-20"
                                  />
                                }
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
                              />
                            }
                          />
                        }
                      />
                    )}
                    <div className="w-full flex items-center justify-center">
                      <DiscreteLegend
                        orientation="horizontal"
                        entries={trimesterLegend.map((i) => (
                          <DiscreteLegendEntry
                            key={i.key}
                            label={i.key}
                            color={i.color}
                          />
                        ))}
                      />
                    </div>
                  </ExportContent>
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
            </Export>
            <div className={`${centerItemsInDiv} pt-8`}>
              <div className="flex flex-row">
                <button
                  className={`${graphTableButtonStyle} ${popularityDisplay == "graph"
                    ? "bg-bcgw-gray-light"
                    : "bg-[#f5f5f5]"
                    }`}
                  onClick={() => setPopularityDisplay("graph")}
                >
                  Graph
                </button>
                <button
                  className={`${graphTableButtonStyle} ${popularityDisplay == "table"
                    ? "bg-bcgw-gray-light"
                    : "bg-[#f5f5f5]"
                    }`}
                  onClick={() => setPopularityDisplay("table")}
                >
                  Table
                </button>
              </div>
              {popularityDisplay === "table" && (
                <Button
                  variant={"outlineGray"}
                  className={
                    "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
                  }
                >
                  Export
                </Button>
              )}
            </div>
            <span className="self-start font-semibold text-2xl">
              {popularityDisplay === "graph" ? (
                <span>Class and Instructor Popularity Over Time</span>
              ) : (
                <span>Attendance By Class & Instructor</span>
              )}
              {popularityDisplay === "graph" ? <br /> : <></>}
              {dateRangeLabel}
            </span>
            {/* Class Popularity Over Time */}
            <div>
              {popularityDisplay === "graph" ? (
                <>
                  <Export title={`ClassPopularity${dateRangeLabel}`}>
                    <div className="flex flex-row items-center w-full">
                      <div className="text-2xl font-semibold grow">
                        Class Popularity
                      </div>

                      <ExportTrigger asChild>
                        <Button
                          variant={"outlineGray"}
                          className={
                            "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
                          }
                        >
                          Export
                        </Button>
                      </ExportTrigger>
                    </div>
                    {/* Class dropdown */}
                    <div className={chartDiv}>
                      <div className="self-end mb-4">
                        <SelectDropdown
                          options={classFilterOptions}
                          selected={selectedClassCategory}
                          onChange={setSelectedClassCategory}
                        />
                      </div>
                      <ExportContent className="w-full h-96">
                        <ExportOnly className="mb-5">
                          <h1 className="text-xl font-bold text-black">
                            Class Popularity{" "}
                          </h1>
                          <p className="text-base text-black">{dateRangeLabel}</p>
                          <p className="text-gray-800 text-sm">
                            {selectedClassCategory}
                          </p>
                        </ExportOnly>
                        <LineChart
                          height={300}
                          data={filteredClassData}
                          series={
                            <LineSeries
                              colorScheme={(item) =>
                                classColorScheme[item[0] ? item[0].key : item.key]
                              }
                              type="grouped"
                            />
                          }
                        />
                        <div className="w-full flex items-center justify-center">
                          <DiscreteLegend
                            orientation="horizontal"
                            entries={filteredClassData.map((line) => (
                              <DiscreteLegendEntry
                                key={line.key}
                                label={line.key}
                                color={classColorScheme[line.key]}
                              />
                            ))}
                          />
                        </div>
                      </ExportContent>
                    </div>
                  </Export>

                  <Export title={`InstructorPopularity${dateRangeLabel}`}>
                    <div className="mt-8 flex flex-row items-center w-full">
                      <div className="text-2xl font-semibold grow">
                        Instructor Popularity
                      </div>

                      <ExportTrigger asChild>
                        <Button
                          variant={"outlineGray"}
                          className={
                            "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
                          }
                        >
                          Export
                        </Button>
                      </ExportTrigger>
                    </div>
                    <div className={chartDiv}>
                      <div className="self-end mb-4">
                        <SelectDropdown
                          options={classFilterOptions}
                          selected={selectedClassCategory}
                          onChange={setSelectedClassCategory}
                        />
                      </div>
                      <ExportContent className="w-full h-96">
                        <ExportOnly className="mb-5">
                          <h1 className="text-xl font-bold text-black">
                            Instructor Popularity
                          </h1>
                          <p className="text-base text-black">{dateRangeLabel}</p>
                          <p className="text-gray-800 text-sm">
                            {selectedClassCategory}
                          </p>
                        </ExportOnly>
                        <LineChart
                          height={300}
                          data={filteredInstructorData}
                          series={
                            <LineSeries
                              colorScheme={(item) =>
                                classColorScheme[item[0] ? item[0].key : item.key]
                              }
                              type="grouped"
                            />
                          }
                        />
                        <div className="w-full flex items-center justify-center">
                          <DiscreteLegend
                            orientation="horizontal"
                            entries={filteredInstructorData.map((line) => (
                              <DiscreteLegendEntry
                                key={line.key}
                                label={line.key}
                                color={classColorScheme[line.key]}
                              />
                            ))}
                          />
                        </div>
                      </ExportContent>
                    </div>
                  </Export>
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
          </>
        )
        }
      </div>
      <InstructorPopup
        openRow={openInstructorRow}
        setOpenRow={setOpenInstructorRow}
      />
    </>
  );
}
