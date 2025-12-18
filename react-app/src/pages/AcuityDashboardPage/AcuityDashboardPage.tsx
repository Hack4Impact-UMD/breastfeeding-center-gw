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
import Loading from "@/components/Loading";
import {
  computeAttendanceMap,
  computeInstructorDataByClass,
  computeTrimesterAttendance,
  normalizeCategory,
} from "@/lib/acuityUtils";

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

  const allInstructors = useMemo(
    () => [
      ...new Set(
        appointmentData
          ?.map((appt) => appt.instructor)
          .filter((i) => i !== null),
      ),
    ],
    [appointmentData],
  );

  const instructorColorScheme = useMemo(() => {
    const colors: Record<string, string> = {};
    const scheme = schemes.unifyviz as string[];
    allInstructors.forEach((inst) => {
      const hash = [...inst].reduce((p, v) => p * v.charCodeAt(0), 1);
      colors[inst] = scheme[hash % scheme.length];
    });
    return colors;
  }, [allInstructors]);

  const classesToCategory = useMemo(() => {
    const map: Map<string, string> = new Map();
    appointmentData?.forEach(
      (appt) =>
        appt.class &&
        appt.classCategory &&
        map.set(appt.class, appt.classCategory),
    );
    return map;
  }, [appointmentData]);

  const trimesterAttendance = useMemo(
    () => computeTrimesterAttendance(appointmentData ?? []),
    [appointmentData],
  );

  const shouldGroupByWeek = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const from = DateTime.fromJSDate(dateRange.from);
    const to = DateTime.fromJSDate(dateRange.to);
    const diffInMonths = to.diff(from, "months").months;
    return diffInMonths <= 3;
  }, [dateRange]);

  const instructorAttendanceByInterval = useMemo(
    () => computeAttendanceMap(appointmentData ?? [], shouldGroupByWeek),
    [appointmentData, shouldGroupByWeek],
  );
  const instructorDataByClass = useMemo(
    () => computeInstructorDataByClass(appointmentData ?? []),
    [appointmentData],
  );

  const allIntervals = useMemo(
    () => Array.from(instructorAttendanceByInterval.keys()).sort(),
    [instructorAttendanceByInterval],
  );

  const allClassData = useMemo(
    () =>
      classFilterOptions
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

              const attendanceForInterval =
                instructorAttendanceByInterval.get(intervalKey);

              let count = 0;
              const attendanceForCat =
                attendanceForInterval?.get(normalizedCategory);
              for (const className of attendanceForCat?.keys() ?? []) {
                const attendanceForClass = attendanceForCat?.get(className);
                for (const instructor of attendanceForClass?.keys() ?? []) {
                  const attendance = attendanceForClass?.get(instructor) ?? 0;
                  count += attendance;
                }
              }
              return { key: date, data: count };
            }),
          };
        }),
    [
      allIntervals,
      classFilterOptions,
      instructorAttendanceByInterval,
      shouldGroupByWeek,
    ],
  );

  const allInstructorData = useMemo(
    () =>
      allInstructors.map((instructor) => {
        return {
          key: instructor,
          data: allIntervals.map((intervalKey) => {
            const date = shouldGroupByWeek
              ? DateTime.fromISO(intervalKey).toJSDate()
              : DateTime.fromFormat(intervalKey, "yyyy-MM")
                  .startOf("month")
                  .toJSDate();
            const attendanceForInterval =
              instructorAttendanceByInterval.get(intervalKey);

            if (!attendanceForInterval) return { key: date, data: 0 };

            let count = 0;
            for (const cat of attendanceForInterval.keys()) {
              const attendanceForCat = attendanceForInterval.get(cat);
              for (const className of attendanceForCat?.keys() ?? []) {
                const attendanceForClass = attendanceForCat?.get(className);
                const attendance = attendanceForClass?.get(instructor) ?? 0;
                count += attendance;
              }
            }

            return { key: date, data: count };
          }),
        };
      }),
    [
      allInstructors,
      allIntervals,
      instructorAttendanceByInterval,
      shouldGroupByWeek,
    ],
  );

  const instructorTableData: InstructorAttendance[] = useMemo(
    () =>
      Array.from(instructorDataByClass.entries()).map(
        ([className, instructorMap]) => {
          const firstInstructor = Array.from(instructorMap.values())[0];
          const classCategory = firstInstructor?.classCategory || "UNKNOWN";

          const instructors: Array<{
            instructor: string;
            avgAttendance: number;
            numClasses: number;
            totalAttendance: number;
          }> = Array.from(instructorMap.entries()).map(
            ([instructor, stats]) => {
              const numClasses = stats.uniqueSessions.size;
              const avgAttendance =
                numClasses > 0 ? stats.count / numClasses : 0;
              return {
                instructor,
                avgAttendance: Math.round(avgAttendance * 100) / 100,
                numClasses,
                totalAttendance: stats.count,
              };
            },
          );

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
              className.length > 15
                ? className.slice(0, 15) + "..."
                : className,
            category: classCategory,
            avgAttendance: Math.round(avgAttendance * 100) / 100,
            numClasses: totalClasses,
            totalAttendance,
            instructorNames: instructors.map((i) => i.instructor).join(", "),
            instructors,
          };
        },
      ),
    [instructorDataByClass],
  );

  const trimesterAttendanceData = useMemo(
    () =>
      classFilterOptions
        .filter((cat) => cat !== "ALL CLASSES")
        .map((category) => {
          const categoryLower = category.toLowerCase();

          return {
            key: category,
            data: trimesterLegend.map((trimester) => ({
              key: trimester.key,
              data:
                trimesterAttendance.get(`${categoryLower} ${trimester.key}`) ??
                0,
            })),
          };
        }),
    [classFilterOptions, trimesterAttendance, trimesterLegend],
  );

  const allClassAttendanceData = useMemo(
    () =>
      classFilterOptions.map((category) => {
        return {
          key: category,
          data: Array.from(classesToCategory.entries()).map(([className]) => {
            const classKey = className.toLowerCase();

            return {
              key: className,
              data: trimesterLegend.map((trimester) => ({
                key: trimester.key,
                data:
                  trimesterAttendance.get(`${classKey} ${trimester.key}`) ?? 0,
              })),
            };
          }),
        };
      }),
    [
      classFilterOptions,
      classesToCategory,
      trimesterAttendance,
      trimesterLegend,
    ],
  );

  const trimesterData: TrimesterAttendance[] = useMemo(
    () =>
      Array.from(classesToCategory.entries()).map(([className, category]) => {
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
      }),
    [classesToCategory, trimesterAttendance],
  );

  const instructorData: InstructorAttendance[] = useMemo(() => {
    const data = instructorTableData;
    if (selectedClassCategory === "ALL CLASSES") return data;
    const selectedCategory = normalizeCategory(selectedClassCategory);
    return data.filter(
      (item) => normalizeCategory(item.category) === selectedCategory,
    );
  }, [instructorTableData, selectedClassCategory]);

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
            <p className="text-center">
              Failed to fetch Acuity data: {apptError.message}
            </p>
          </div>
        ) : (
          <>
            <Export title={`ClassAttendanceByTrimester${dateRangeLabel}`}>
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
                          <p className="text-base text-black">
                            {dateRangeLabel}
                          </p>
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
                                classColorScheme[
                                  item[0] ? item[0].key : item.key
                                ]
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
                          <p className="text-base text-black">
                            {dateRangeLabel}
                          </p>
                          <p className="text-gray-800 text-sm">
                            {selectedClassCategory}
                          </p>
                        </ExportOnly>
                        <LineChart
                          height={300}
                          data={allInstructorData}
                          series={
                            <LineSeries
                              colorScheme={(item) =>
                                item[0]
                                  ? instructorColorScheme[item[0].key]
                                  : instructorColorScheme[item.key]
                              }
                              type="grouped"
                            />
                          }
                        />
                        <div className="w-full flex items-center justify-center">
                          <DiscreteLegend
                            orientation="horizontal"
                            entries={allInstructorData.map((line) => (
                              <DiscreteLegendEntry
                                key={line.key}
                                label={line.key}
                                color={instructorColorScheme[line.key]}
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
                  columns={instructorColumns((row) =>
                    setOpenInstructorRow(row),
                  )}
                  data={instructorData}
                  tableType="default"
                  tableHeaderExtras={classPopularityTableExtras}
                  pageSize={5}
                />
              )}
            </div>
          </>
        )}
      </div>
      <InstructorPopup
        openRow={openInstructorRow}
        setOpenRow={setOpenInstructorRow}
      />
    </>
  );
}
