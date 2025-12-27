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
  computeAttendanceBreakdown,
  computeInstructorDataByClass,
  computeTrimesterBreakdownByCategory,
  computeTrimesterBreakdownByClass,
} from "@/lib/acuityUtils";
import {
  useAllInstructorData as useInstructorPopularityData,
  useCategoryAttendanceData,
  useClassAttendanceByTrimesterData,
  useClassAttendanceData,
  useInstructorTableData,
  useTrimesterAttendanceData as useCategoryAttendanceByTrimesterData,
  useTrimesterTableData,
} from "./acuityDataHooks";
import { assignColorScheme } from "@/lib/colorUtils";
import { exportCsv } from "@/lib/tableExportUtils";

const CLASS_FILTER_OPTIONS = [
  "ALL CLASSES",
  "POSTPARTUM CLASSES",
  "PRENATAL CLASSES",
  "INFANT MASSAGE",
  "PARENT GROUPS",
  "CHILDBIRTH CLASSES",
];

const TRIMESTER_LEGEND = [
  { key: "FIRST TRIM", color: "#FCD484" },
  { key: "SECOND TRIM", color: "#FFAA00" },
  { key: "THIRD TRIM", color: "#5DB9FF" },
  { key: "FOURTH TRIM", color: "#1661A9" },
  { key: "FIFTH TRIM", color: "#05182A" },
];

const CLASS_CAT_COLOR_SCHEME: Record<string, string> = {
  "POSTPARTUM CLASSES": schemes.cybertron[0],
  "PRENATAL CLASSES": schemes.cybertron[1],
  "INFANT MASSAGE": schemes.cybertron[2],
  "PARENT GROUPS": schemes.cybertron[3],
  "CHILDBIRTH CLASSES": schemes.cybertron[4],
};

const truncateInstructorName = (instructor: string) => instructor.split(",")[0];

export default function AcuityDashboardPage() {
  const [attendanceDisplay, setAttendanceDisplay] = useState<"graph" | "table">(
    "graph",
  );
  const [popularityDisplay, setPopularityDisplay] = useState<"graph" | "table">(
    "graph",
  );
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

  const shouldGroupByWeek = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const from = DateTime.fromJSDate(dateRange.from);
    const to = DateTime.fromJSDate(dateRange.to);
    const diffInMonths = to.diff(from, "months").months;
    return diffInMonths <= 3;
  }, [dateRange]);

  const attendanceBreakdown = useMemo(
    () => computeAttendanceBreakdown(appointmentData ?? [], shouldGroupByWeek),
    [appointmentData, shouldGroupByWeek],
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

  const allIntervals = useMemo(
    () => Array.from(attendanceBreakdown.keys()).sort(),
    [attendanceBreakdown],
  );

  const allClasses = useMemo(
    () => [
      ...new Set(
        appointmentData?.map((appt) => appt.class).filter((c) => c !== null),
      ),
    ],
    [appointmentData],
  );

  const instructorColorScheme = useMemo(
    () => assignColorScheme(allInstructors, schemes.unifyviz),
    [allInstructors],
  );
  const classColorScheme = useMemo(
    () => assignColorScheme(allClasses, schemes.unifyviz),
    [allClasses],
  );

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

  const trimesterAttendanceByCategory = useMemo(
    () => computeTrimesterBreakdownByCategory(appointmentData ?? []),
    [appointmentData],
  );

  const trimesterAttendanceByClass = useMemo(
    () => computeTrimesterBreakdownByClass(appointmentData ?? []),
    [appointmentData],
  );

  const instructorDataByClass = useMemo(
    () => computeInstructorDataByClass(appointmentData ?? []),
    [appointmentData],
  );

  const classAttendanceData = useClassAttendanceData(
    attendanceBreakdown,
    allClasses,
    allIntervals,
    classesToCategory,
    shouldGroupByWeek,
  );
  const categoryAttendanceData = useCategoryAttendanceData(
    attendanceBreakdown,
    CLASS_FILTER_OPTIONS,
    allIntervals,
    shouldGroupByWeek,
  );
  const instructorPopularityGraphData = useInstructorPopularityData(
    attendanceBreakdown,
    allInstructors,
    allIntervals,
    shouldGroupByWeek,
  );
  const instructorTableData: InstructorAttendance[] = useInstructorTableData(
    instructorDataByClass,
  );

  const exportableInstructorTableData = useMemo(
    () =>
      instructorTableData.map(
        ({ instructors, ...rest }) =>
          ({
            ...rest,
          }) as Omit<InstructorAttendance, "instructors">,
      ),
    [instructorTableData],
  );

  const trimesterAttendanceGraphDataByCategory =
    useCategoryAttendanceByTrimesterData(
      trimesterAttendanceByCategory,
      CLASS_FILTER_OPTIONS,
      TRIMESTER_LEGEND,
    );
  const trimesterAttendanceGraphDataByClass = useClassAttendanceByTrimesterData(
    trimesterAttendanceByClass,
    classesToCategory,
    TRIMESTER_LEGEND,
  );
  const trimesterTableData: TrimesterAttendance[] = useTrimesterTableData(
    trimesterAttendanceByClass,
    classesToCategory,
  );

  // Styles
  const centerItemsInDiv = "flex justify-between items-center";
  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer";

  // Filter class data based on selection
  const filteredClassPopularityGraphData =
    selectedClassCategory === "ALL CLASSES"
      ? categoryAttendanceData
      : classAttendanceData;

  const classAttendanceTableExtras = (
    <div className="w-full flex justify-end p-2">
      <SelectDropdown
        options={CLASS_FILTER_OPTIONS}
        selected={selectedClassCategory}
        onChange={setSelectedClassCategory}
      />
    </div>
  );

  const classPopularityTableExtras = (
    <div className="w-full flex justify-end p-2">
      <SelectDropdown
        options={CLASS_FILTER_OPTIONS}
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
                {attendanceDisplay === "table" ? (
                  <Button
                    variant={"outlineGray"}
                    className={
                      "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
                    }
                    onClick={() =>
                      exportCsv(
                        trimesterTableData,
                        `acuity_class_attendance_by_trimester${dateRange?.from?.toISOString()}_${dateRange?.to?.toISOString()}_${selectedClassCategory}`,
                      )
                    }
                  >
                    Export
                  </Button>
                ) : (
                  <ExportTrigger
                    disabled={attendanceDisplay !== "graph"}
                    asChild
                  >
                    <Button
                      variant={"outlineGray"}
                      className={
                        "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
                      }
                    >
                      Export
                    </Button>
                  </ExportTrigger>
                )}
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
                      options={CLASS_FILTER_OPTIONS}
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
                    <StackedBarChart
                      height={350}
                      data={
                        selectedClassCategory === "ALL CLASSES"
                          ? trimesterAttendanceGraphDataByCategory
                          : trimesterAttendanceGraphDataByClass
                      }
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
                          colorScheme={TRIMESTER_LEGEND.map((i) => i.color)}
                        />
                      }
                    />
                    <div className="w-full flex items-center justify-center">
                      <DiscreteLegend
                        orientation="horizontal"
                        entries={TRIMESTER_LEGEND.map((i) => (
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
                  data={trimesterTableData}
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
                  onClick={() =>
                    exportCsv(
                      exportableInstructorTableData,
                      `acuity_class_popularity_${dateRange?.from?.toISOString()}_${dateRange?.to?.toISOString()}_${selectedClassCategory}`,
                    )
                  }
                >
                  Export
                </Button>
              )}
            </div>
            <span className="self-start font-semibold text-2xl">
              {popularityDisplay === "graph" ? (
                <span>Class and Instructor Popularity Over Time,</span>
              ) : (
                <span>Attendance By Class & Instructor,</span>
              )}
              {popularityDisplay === "graph" ? <br /> : <> </>}
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
                          options={CLASS_FILTER_OPTIONS}
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
                          data={filteredClassPopularityGraphData}
                          series={
                            <LineSeries
                              colorScheme={(item) =>
                                (selectedClassCategory === "ALL CLASSES"
                                  ? CLASS_CAT_COLOR_SCHEME
                                  : classColorScheme)[
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
                            entries={filteredClassPopularityGraphData.map(
                              (line) => (
                                <DiscreteLegendEntry
                                  key={line.key}
                                  label={line.key}
                                  color={
                                    (selectedClassCategory === "ALL CLASSES"
                                      ? CLASS_CAT_COLOR_SCHEME
                                      : classColorScheme)[line.key]
                                  }
                                />
                              ),
                            )}
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
                          options={CLASS_FILTER_OPTIONS}
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
                          data={instructorPopularityGraphData}
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
                            entries={instructorPopularityGraphData.map(
                              (line) => (
                                <DiscreteLegendEntry
                                  key={line.key}
                                  label={truncateInstructorName(line.key)}
                                  color={instructorColorScheme[line.key]}
                                />
                              ),
                            )}
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
                  data={instructorTableData}
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
