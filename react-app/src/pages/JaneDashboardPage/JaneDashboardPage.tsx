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
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer border border-gray-300";
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
      key: "1st week",
    },
    {
      data: 40,
      key: "2nd week",
    },
    {
      data: 34,
      key: "3rd week",
    },
    {
      data: 25,
      key: "4th week",
    },
    {
      data: 20,
      key: "5th week",
    },
    {
      data: 18,
      key: "6th week",
    },
  ];

  const retentionFileTitle = () => {
    const dr =
      dateRange.startDate && dateRange.endDate
        ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
        : "All Data";
    return `jane-retention-${dr.replaceAll(" ", "").replaceAll("/", "-")}`;
  };

  function buildFunnelSVGString(
    data: Array<{ key: string; data: number }>,
    width = 1000,
    height = 420,
    palette = ["#0F2742", "#1C2E56", "#2C3B6D", "#3D4A83", "#4E5A97", "#6370AD"]
  ) {
    const paddingX = 10;
    const segHeight = 220;
    const centerY = height / 2;
    const gap = 12;
    const maxW = width - paddingX * 2 - 80;

    const maxVal = Math.max(...data.map((d) => d.data));
    const scale = (v: number) => Math.max(60, (v / maxVal) * maxW);

    let x = paddingX + 60;
    const parts: string[] = [];

    // background
    parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#FFFFFF"/>`);

    // left axis label
    parts.push(
      `<g transform="translate(${paddingX}, ${centerY}) rotate(-90)">
       <text x="0" y="0" text-anchor="middle" font-size="18" font-weight="600" fill="#1F2937">
         Number of Clients
       </text>
     </g>`
    );

    for (let i = 0; i < data.length; i++) {
      const leftW = scale(data[i].data);
      const rightW = scale(data[i + 1]?.data ?? data[i].data);
      const halfH = segHeight / 2;

      const tlx = x, tly = centerY - halfH;
      const trx = x + leftW, try_ = centerY - halfH;
      const brx = x + rightW, bry = centerY + halfH;
      const blx = x, bly = centerY + halfH;

      const path = `M ${tlx},${tly} L ${trx},${try_} L ${brx},${bry} L ${blx},${bly} Z`;
      const cx = x + Math.min(leftW, rightW) / 2 + Math.abs(leftW - rightW) / 4;

      parts.push(`<path d="${path}" fill="${palette[i % palette.length]}" />`);

      // big number
      parts.push(
        `<text x="${cx}" y="${centerY - 8}" text-anchor="middle" font-size="36" font-weight="600" fill="#FFFFFF">
        ${data[i].data}
       </text>`
      );

      // small label
      parts.push(
        `<text x="${cx}" y="${centerY + 20}" text-anchor="middle" font-size="16" fill="#E5E7EB">
        ${data[i].key}
       </text>`
      );

      x += Math.min(rightW, leftW) + gap;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${parts.join(
      ""
    )}</svg>`;
  }


  const handleExportRetention = async () => {
    // Title and lines under it (Figma wants title + date range + filters)
    const title = `Retention Rate over a Six Week Period`;
    const dr =
      dateRange.startDate && dateRange.endDate
        ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
        : "All Data";

    const svgString = buildFunnelSVGString(funnelData, 1000, 420);
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    const exportContent = (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src={dataUri}
          width={1000}
          height={420}
          alt="Jane retention funnel"
          style={{ display: "block" }}
        />
      </div>
    );



    await exportAsSvg({
      content: exportContent,
      title: `${title}, ${dr}`,
      dateRange: null, // already appended to title per Figma
      selectedFilters: {
        // show selected dropdowns beneath title, as required
        Clients: clientsFilter,
        Clinicians: cliniciansFilter,
      },
      width: 1200,
      height: 760,
      filename: retentionFileTitle(),
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

  const chartColors = ["#f4bb47", "#05182a", "#3A8D8E"];

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
                        Number of Visits
                      </span>

                      <FunnelChart
                        height={290}
                        width={400}
                        data={funnelData}
                        series={
                          <FunnelSeries
                            arc={<FunnelArc colorScheme="#05182A" />}
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