import React, { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { PieArcSeries, PieChart } from "reaviz";
import { JaneAppt } from "../../types/JaneType.ts";
import Loading from "../../components/Loading.tsx";
import { toPng } from "html-to-image";
import download from "downloadjs";
import {
  DateRangePicker,
  defaultPresets,
  defaultDateRange,
  DateRange,
} from "@/components/DateRangePicker/DateRangePicker.tsx";
import { VisitBreakdown, visitBreakdownColumns } from "./JaneTableColumns";
import { DataTable } from "@/components/DataTable/DataTable";
import { useJaneAppts } from "@/hooks/queries/useJaneData.ts";
import { Button } from "@/components/ui/button.tsx";
import JaneRetention from "./JaneRetention.tsx";

function BreakdownPieChartLabels(chartData: { key: string; data: number }[]) {
  if (chartData.length === 0) return <></>;
  const total = chartData.reduce((sum, item) => sum + item.data, 0);
  return chartData.map((item, index) => {
    if (total === 0) return <></>;

    const percentage = ((item.data / total) * 100).toFixed(0);
    const angle =
      chartData
        .slice(0, index)
        .reduce((sum, d) => sum + (d.data / total) * 360, 0) +
      ((item.data / total) * 360) / 2;
    const radians = ((angle - 90) * Math.PI) / 180;
    const radius = 122;
    const x = 150 + radius * Math.cos(radians);
    const y = 150 + radius * Math.sin(radians);

    return (
      <div
        key={item.key}
        className={`absolute font-semibold text-sm text-white`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {percentage}%
      </div>
    );
  });
}

const JaneDashboardPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );

  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer border border-gray-300";
  const centerItemsInDiv = "flex justify-between items-center";
  const chartDiv =
    "flex flex-col items-center justify-start bg-white min-h-[400px] border-2 border-black p-5 mt-5 rounded-lg";

  const {
    data: janeAppts,
    isLoading,
    error,
  } = useJaneAppts(
    dateRange?.from?.toISOString(),
    dateRange?.to?.toISOString(),
  );

  const [visitDisplay, setVisitDisplay] = useState<string>("graph");
  const pieChartRef = useRef<HTMLDivElement>(null);

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

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

  const chartColors = ["#f4bb47", "#05182a", "#3A8D8E"];

  const visitTypeMap = useMemo(
    () =>
      new Map<string, string>([
        ["HOMEVISIT", "Home Visit"],
        ["OFFICE", "In Office"],
        ["TELEHEALTH", "Telehealth"],
        ["TOTAL", "Total"],
      ]),
    [],
  );

  const { chartBreakdownData: chartData, visitBreakdownData } = useMemo(() => {
    if (!janeAppts || janeAppts.length === 0)
      return {
        chartBreakdownData: [],
        visitBreakdownData: [],
      };

    const breakdown = new Map<string, number>();
    janeAppts.forEach((janeAppt: JaneAppt) => {
      const mappedType = visitTypeMap.get(janeAppt.visitType);
      if (mappedType) {
        const current = breakdown.get(mappedType) ?? 0;
        breakdown.set(mappedType, current + 1);
      }
    });

    const chartBreakdownData = Array.from(breakdown, ([key, data]) => ({
      key,
      data,
    }));

    const visitBreakdown: VisitBreakdown[] = [];
    for (const visitType of visitTypeMap.values()) {
      if (visitType === "Total") {
        const visitData = {
          visitType: visitType,
          percent: 100,
          count: janeAppts.length,
        };
        visitBreakdown.push(visitData);
      } else {
        const visitData = {
          visitType: visitType,
          percent: Number(
            (
              ((breakdown.get(visitType) ?? 0) * 100) /
              janeAppts.length
            ).toFixed(1),
          ),
          count: breakdown.get(visitType) ?? 0,
        };
        visitBreakdown.push(visitData);
      }
    }
    return {
      chartBreakdownData: chartBreakdownData ?? [],
      visitBreakdownData: visitBreakdown ?? [],
    };
  }, [janeAppts, visitTypeMap]);

  const visitBreakdownPieChartLabels = useMemo(
    () => BreakdownPieChartLabels(chartData),
    [chartData],
  );

  if (error)
    return (
      <p className="text-center text-red-500">
        Failed to fetch Jane appointments: {error.message}
      </p>
    );

  return (
    <>
      <div className="flex flex-col py-14 px-10 sm:px-20">
        <div className="flex flex-col-reverse gap-4  md:flex-row md:items-center justify-between mb-4">
          <h1 className="font-bold text-4xl lg:text-5xl">Jane</h1>
          <div className="w-full flex justify-end">
            <DateRangePicker
              enableYearNavigation
              value={dateRange}
              onChange={(range) => setDateRange(range)}
              presets={defaultPresets}
              className="w-60"
            />
          </div>
        </div>

        <div className={`${centerItemsInDiv} basis-20xs`}>
          <Link to="/services/jane/data">
            <Button
              variant={"yellow"}
              className={"rounded-full text-lg w-full py-6 px-8"}
            >
              VIEW UPLOADED DATA
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pt-3">
          <div className="flex-[0_0_100%] max-w-full min-w-[200px] md:flex-[0_0_48%] lg:w-1/2">
            <div className="flex items-center justify-between w-full pt-4 mb-6">
              <div className="flex w-[175px] h-10 overflow-hidden ">
                <button
                  className={`${graphTableButtonStyle} ${
                    visitDisplay === "graph"
                      ? "bg-bcgw-gray-light"
                      : "bg-[#CED8E1]"
                  }`}
                  onClick={() => setVisitDisplay("graph")}
                >
                  Graph
                </button>
                <button
                  className={`${graphTableButtonStyle} ${
                    visitDisplay === "table"
                      ? "bg-bcgw-gray-light"
                      : "bg-[#CED8E1]"
                  }`}
                  onClick={() => setVisitDisplay("table")}
                >
                  Table
                </button>
              </div>
              <Button
                variant={"outlineGray"}
                className={
                  "text-md rounded-full border-2 py-4 hover:bg-bcgw-gray-light"
                }
                onClick={() => handleExport(pieChartRef, "visit_breakdown")}
              >
                Export
              </Button>
            </div>

            {visitDisplay === "graph" ? (
              <>
                <span className="self-start font-semibold text-2xl mb-20">
                  Visit Breakdown:{" "}
                  {dateRange?.from && dateRange?.to
                    ? formatDate(dateRange.from) +
                      " - " +
                      formatDate(dateRange.to)
                    : "All Data"}
                </span>
                <div className={chartDiv} ref={pieChartRef}>
                  <div className="relative">
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <>
                        <PieChart
                          data={chartData}
                          series={
                            <PieArcSeries
                              doughnut={true}
                              colorScheme={chartColors}
                              label={null}
                            />
                          }
                          height={300}
                          width={300}
                        />
                        {visitBreakdownPieChartLabels}
                      </>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-4">
                    {chartData.map((item, index) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <div
                          className="w-10 h-4"
                          style={{
                            backgroundColor:
                              chartColors[index % chartColors.length],
                          }}
                        />
                        <span>{item.key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <span className="font-semibold text-2xl">
                  Visit Breakdown:{" "}
                  {dateRange?.from && dateRange?.to
                    ? formatDate(dateRange.from) +
                      " - " +
                      formatDate(dateRange.to)
                    : "All Data"}
                </span>
                <DataTable
                  columns={visitBreakdownColumns}
                  data={visitBreakdownData}
                  tableType="default"
                />
              </div>
            )}
          </div>

          <JaneRetention
            startDate={dateRange?.from}
            endDate={dateRange?.to}
          ></JaneRetention>
        </div>
      </div>
    </>
  );
};

export default JaneDashboardPage;
