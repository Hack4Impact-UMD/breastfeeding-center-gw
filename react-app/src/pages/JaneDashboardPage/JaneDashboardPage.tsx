import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header.tsx";
import NavigationBar from "../../components/NavigationBar/NavigationBar.tsx";
import ClientLostPopup from "./ClientLostPopup.tsx";
import {
  PieArcSeries,
  PieChart,
  FunnelChart,
  FunnelAxis,
  FunnelAxisLabel,
  FunnelArc,
  FunnelAxisLine,
  FunnelSeries,
} from "reaviz";
import { Jane } from "../../types/JaneType.ts";
import { getAllJaneData } from "../../backend/FirestoreCalls.tsx";
import Loading from "../../components/Loading.tsx";
import { exportAsSvg } from "@/components/Exportable";
import {
  DateRangePicker,
  defaultPresets,
  defaultDateRange,
  DateRange,
} from "@/components/DateRangePicker/DateRangePicker.tsx";
import {
  VisitBreakdown,
  visitBreakdownColumns,
  RetentionRate,
  makeRetentionRateColumns,
} from "./JaneTableColumns";
import { DataTable } from "@/components/DataTable/DataTable";
const JaneDashboardPage = () => {
  const [navBarOpen, setNavBarOpen] = useState(true);
  //dropdown
  const [selectedDropdown, setSelectedDropdown] = useState("ALL CLIENTS");
  //styles
  const buttonStyle =
    "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light text-lg border-1 border-black-500 py-2 px-8 rounded-full cursor-pointer";
  const transparentGrayButtonStyle =
    "bg-transparent hover:bg-bcgw-gray-light text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";
  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#F5F5F5] hover:shadow-md text-black cursor-pointer border border-gray-300";
  const centerItemsInDiv = "flex justify-between items-center";
  const chartDiv =
    "flex flex-col items-center justify-start bg-white h-[370px] border-2 border-black p-5 mt-5 rounded-lg";
  const [janeData, setJaneData] = useState<Jane[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<{ key: string; data: number }[]>(
    [],
  );
  const [visitDisplay, setVisitDisplay] = useState<string>("graph");
  const [retentionDisplay, setRetentionDisplay] = useState<string>("graph");
  const [openRow, setOpenRow] = useState<RetentionRate | null>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const funnelChartRef = useRef<HTMLDivElement>(null);
  const funnelData = [
    {
      data: 50,
      key: "1 visit",
    },
    {
      data: 40,
      key: "2 visits",
    },
    {
      data: 34,
      key: "3 visits",
    },
    {
      data: 25,
      key: "4 visits",
    },
    {
      data: 20,
      key: "5 visits",
    },
    {
      data: 16,
      key: "6 visits",
    },
  ];
  const retentionFileTitle = () => {
    const dr =
      dateRange.startDate && dateRange.endDate
        ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
        : "All Data";
    return `jane-retention-${dr.replaceAll(" ", "").replaceAll("/", "-")}`;
  };
  const handleExportRetention = async () => {
    // Title & date
    const title = `Retention Rate over a Six Week Period`;
    const dr =
      dateRange.startDate && dateRange.endDate
        ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
        : "All Data";
    // 1) Grab the live SVG that Reaviz rendered
    const container = funnelChartRef.current;
    if (!container) {
      alert("Funnel chart not found.");
      return;
    }
    const svgEl = container.querySelector("svg");
    if (!svgEl) {
      alert("Funnel SVG not found.");
      return;
    }
    // Normalize size so the export is consistent
    const innerW = 1000;
    const innerH = 420;
    svgEl.setAttribute("width", String(innerW));
    svgEl.setAttribute("height", String(innerH));
    // Serialize the chart SVG
    const rawChartSvg = new XMLSerializer().serializeToString(svgEl);
    const chartDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(rawChartSvg)}`;
    // 2) Build a composite SVG that includes:
    //    - left axis label ("Number of Clients") as real SVG text (rotated)
    //    - the original chart SVG positioned with a left margin
    const leftMargin = 80; // space for vertical label
    const totalW = innerW + leftMargin;
    const totalH = innerH;
    const compositeSvgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}">
      <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="#FFFFFF" />
      <!-- Vertical axis label -->
      <g transform="translate(30 ${totalH / 2}) rotate(-90)">
        <text text-anchor="middle" font-size="18" font-weight="600" fill="#1F2937">
          Number of Clients
        </text>
      </g>
      <!-- The actual Reaviz chart -->
      <image href="${chartDataUri}" x="${leftMargin}" y="0" width="${innerW}" height="${innerH}" />
    </svg>
  `;
    const compositeDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
      compositeSvgString
    )}`;
    // 3) Build Satori content – keep it super simple (no transforms/absolute)
    const exportContent = (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <img
          src={compositeDataUri}
          width={totalW}
          height={totalH}
          alt="Jane retention funnel"
          style={{ display: "block" }}
        />
      </div>
    );
    // 4) Export with Satori
    await exportAsSvg({
      content: exportContent,
      title: `${title}, ${dr}`,
      selectedFilters: {
        Clients: clientsFilter,
        Clinicians: cliniciansFilter,
      },
      width: 1200,
      height: 760,
      filename: `jane-retention-${dr.replaceAll(" ", "").replaceAll("/", "-")}`,
      backgroundColor: "#FFFFFF",
    });
  };
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [clientsFilter, setClientsFilter] = useState<string>("ALL CLIENTS");
  const [cliniciansFilter, setCliniciansFilter] =
    useState<string>("ALL CLINICIANS");
  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    if (newRange) {
      if (newRange.from && newRange.to) {
        setDateRange({
          startDate: newRange.from,
          endDate: newRange.to,
        });
        filterData();
      } else {
        setDateRange({
          startDate: null,
          endDate: null,
        });
      }
    }
  };
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  const filterData = () => {
    const visitTypeCounts: Record<string, number> = {};
    const filteredData = janeData.filter((jane) => {
      if (dateRange.startDate && dateRange.endDate) {
        const appointmentDate = new Date(jane.date);
        return (
          appointmentDate >= dateRange.startDate &&
          appointmentDate <= dateRange.endDate
        );
      }
      return true;
    });
    filteredData.forEach((jane) => {
      const type = jane.visitType || "Unknown";
      visitTypeCounts[type] = (visitTypeCounts[type] || 0) + 1;
    });
    const chartData = Object.entries(visitTypeCounts).map(([key, value]) => ({
      key,
      data: value,
    }));
    setChartData(chartData);
  };
  const chartColors = ["#F4BB47", "#05182A", "#3A8D8E"];
  const visitBreakdownData: VisitBreakdown[] = [
    { visitType: "Home Visit", percent: 16.6, count: 150000 },
    { visitType: "In Office", percent: 16.6, count: 150000 },
    { visitType: "Telehealth", percent: 66.6, count: 600000 },
    { visitType: "Total", percent: 100, count: 900000 },
  ];
  const retentionData: RetentionRate[] = [
    {
      visit: "1 Visit",
      numberVisited: 12,
      percent: 16.6,
      loss: 0,
      clientsLostNames: "",
      clients: [],
    },
    {
      visit: "2 Visits",
      numberVisited: 14,
      percent: 4.23,
      loss: 5,
      clientsLostNames: "Jane Doe, Jane Doe, Jane Doe, Jane Doe, Jane Doe",
      clients: [
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
      ],
    },
    {
      visit: "3 Visits",
      numberVisited: 10,
      percent: 16.6,
      loss: 2,
      clientsLostNames: "Jane Doe, Jane Doe",
      clients: [
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
      ],
    },
    {
      visit: "4 Visits",
      numberVisited: 9,
      percent: 16.6,
      loss: 1,
      clientsLostNames: "Jane Doe",
      clients: [{ first: "Jane", last: "Doe", email: "jdoe@gmail.com" }],
    },
    {
      visit: "5 Visits",
      numberVisited: 8,
      percent: 28.88,
      loss: 9,
      clientsLostNames: "Jane Doe, Jane Doe, Jane Doe, Jane Doe, Jane Doe",
      clients: [
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
        { first: "Jane", last: "Doe", email: "jdoe@gmail.com" },
      ],
    },
    {
      visit: "6+ Visits",
      numberVisited: 7,
      percent: 16.6,
      loss: 1,
      clientsLostNames: "Jane Doe",
      clients: [{ first: "Jane", last: "Doe", email: "jdoe@gmail.com" }],
    },
  ];
  useEffect(() => {
    setLoading(true);
    getAllJaneData().then((janeData) => {
      setJaneData(janeData);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    filterData();
  }, [janeData, dateRange]);
  const retentionHeaderExtras = (
    <div className="w-full flex items-center justify-end gap-3">
      <select
        value={clientsFilter}
        onChange={(e) => setClientsFilter(e.target.value)}
        className="border border-black rounded-md px-3 py-1 text-sm bg-white h-9"
      >
        <option>ALL CLIENTS</option>
        <option>RECENT CHILDBIRTH</option>
        <option>POSTPARTUM</option>
      </select>
      <select
        value={cliniciansFilter}
        onChange={(e) => setCliniciansFilter(e.target.value)}
        className="border border-black rounded-md px-3 py-1 text-sm bg-white h-9"
      >
        <option>ALL CLINICIANS</option>
        <option>Dr. Smith</option>
        <option>Dr. Jones</option>
      </select>
    </div>
  );
  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${navBarOpen ? "ml-[250px]" : "ml-[60px]" //set margin of content to 250px when nav bar is open and 60px when closed
          }`}
      >
        <Header />
        <div className="flex flex-col p-8 pr-20 pl-20">
          <div className={centerItemsInDiv}>
            <h1 className="font-bold">JANE</h1>
            {/* date picker */}
            <div className="w-60">
              <DateRangePicker
                enableYearNavigation
                defaultValue={defaultDateRange}
                onChange={handleDateRangeChange}
                presets={defaultPresets}
                className="w-60"
              />
            </div>
          </div>
          <div className={`${centerItemsInDiv} basis-20xs mt-6`}>
            <Link to="/services/jane/data">
              <button className={`${buttonStyle} mr-5 text-nowrap`}>
                VIEW UPLOADED DATA
              </button>
            </Link>
          </div>
          {/* IMPORTANT: when either table switches to "table" view we remove the side-by-side flex so they stack */}
          <div className="flex flex-wrap gap-8 pt-3">
            {/* Visit Breakdown */}
            <div className="flex-[0_0_48%] max-w-[50%] min-w-[560px]">
              <div className={`${centerItemsInDiv} pt-4 mb-6`}>
                <div className="flex flex-row">
                  <button
                    className={`${graphTableButtonStyle} ${visitDisplay == "graph"
                      ? "bg-bcgw-gray-light"
                      : "bg-[#CED8E1]"
                      }`}
                    onClick={() => setVisitDisplay("graph")}
                  >
                    Graph
                  </button>
                  <button
                    className={`${graphTableButtonStyle} ${visitDisplay == "table"
                      ? "bg-bcgw-gray-light"
                      : "bg-[#CED8E1]"
                      }`}
                    onClick={() => setVisitDisplay("table")}
                  >
                    Table
                  </button>
                </div>
                <button
                  className={transparentGrayButtonStyle}
                  disabled={retentionDisplay !== "graph"} // only export when graph tab is active
                  onClick={handleExportRetention}
                >
                  Export
                </button>
              </div>
              {/*chart title*/}
              {visitDisplay === "graph" ? (
                <>
                  <span className="self-start font-semibold text-2xl mb-20">
                    Visit Breakdown:{" "}
                    {dateRange.startDate && dateRange.endDate
                      ? formatDate(dateRange.startDate) +
                      " - " +
                      formatDate(dateRange.endDate)
                      : "All Data"}
                  </span>
                  <div className={chartDiv} ref={pieChartRef}>
                    {/*chart*/}
                    {chartData.length > 0 ? (
                      <div
                        className="chartContainer"
                        style={{ width: "250px", height: "250px" }}
                      >
                        {loading ? (
                          <Loading />
                        ) : (
                          <PieChart
                            data={chartData}
                            series={
                              <PieArcSeries
                                doughnut={true}
                                colorScheme={chartColors}
                                label={null}
                              />
                            }
                          />
                        )}
                      </div>
                    ) : (
                      <div>No data available for selected date range</div>
                    )}
                    {/*legend*/}
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
                    {dateRange.startDate && dateRange.endDate
                      ? formatDate(dateRange.startDate) +
                      " - " +
                      formatDate(dateRange.endDate)
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
            {/* Retention Rate */}
            <div className="flex-[0_0_48%] max-w-[50%] min-w-[560px]">
              <div className={`${centerItemsInDiv} pt-4 mb-6`}>
                <div className="flex flex-row">
                  <button
                    className={`${graphTableButtonStyle} ${retentionDisplay == "graph"
                      ? "bg-bcgw-gray-light"
                      : "bg-[#CED8E1]"
                      }`}
                    onClick={() => setRetentionDisplay("graph")}
                  >
                    Graph
                  </button>
                  <button
                    className={`${graphTableButtonStyle} ${retentionDisplay == "table"
                      ? "bg-bcgw-gray-light"
                      : "bg-[#CED8E1]"
                      }`}
                    onClick={() => setRetentionDisplay("table")}
                  >
                    Table
                  </button>
                </div>
                <button
                  className={transparentGrayButtonStyle}
                  disabled={retentionDisplay !== "graph"} // only export when graph tab is active
                  onClick={handleExportRetention}
                >
                  Export
                </button>
              </div>
              <span className="self-start font-semibold text-2xl">
                Retention Rate:{" "}
                {dateRange.startDate && dateRange.endDate
                  ? formatDate(dateRange.startDate) +
                  " - " +
                  formatDate(dateRange.endDate)
                  : "All Data"}
              </span>
              <div
                className={retentionDisplay === "graph" ? chartDiv : ""}
                ref={funnelChartRef}
              >
                {retentionDisplay === "graph" ? (
                  <>
                    <div className="self-end">
                      <label className="text-sm font-medium"></label>
                      <select
                        className="border rounded-md px-2 py-1 text-sm"
                        value={selectedDropdown}
                        onChange={(e) => setSelectedDropdown(e.target.value)}
                      >
                        <option>ALL CLIENTS</option>
                        <option>RECENT CHILDBIRTH</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xl whitespace-nowrap -rotate-90 -mr-15 -ml-15">
                        Number of Clients
                      </span>
                      <FunnelChart
                        height={290}
                        width={400}
                        data={funnelData}
                        series={
                          <FunnelSeries
                            arc={<FunnelArc colorScheme="#01284dff" />}
                            axis={
                              <FunnelAxis
                                line={
                                  <FunnelAxisLine
                                    strokeColor="#FFFFFF"
                                    strokeWidth={5}
                                  ></FunnelAxisLine>
                                }
                                label={
                                  <FunnelAxisLabel
                                    className=""
                                    labelVisibility="always"
                                    fontSize={15}
                                    position="middle"
                                    fill="#FFFFFF"
                                  />
                                }
                              />
                            }
                          />
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="[&_td]:py-3 [&_th]:py-3">
                      <DataTable
                        columns={makeRetentionRateColumns((row) =>
                          setOpenRow(row),
                        )}
                        data={retentionData}
                        tableType="default"
                        tableHeaderExtras={retentionHeaderExtras}
                      />
                    </div>
                    {openRow && (
                      <ClientLostPopup
                        openRow={openRow!}
                        setOpenRow={setOpenRow}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default JaneDashboardPage;














