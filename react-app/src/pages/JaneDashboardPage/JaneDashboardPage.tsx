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

  const chartColors = ["#4A6B7C", "#F5C842", "#1F3A5F"];

  const defaultVisitChart = [
    { key: "Telehealth", data: 39 },
    { key: "In Office", data: 29 },
    { key: "Home Visit", data: 32 },
  ];

  const [janeData, setJaneData] = useState<Jane[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<{ key: string; data: number }[]>([
    { key: "Telehealth", data: 39 },
    { key: "Home Visit", data: 32 },
    { key: "In Office", data: 29 }
  ]);
  const [visitDisplay, setVisitDisplay] = useState<string>("graph");
  const [retentionDisplay, setRetentionDisplay] = useState<string>("graph");
  const [openRow, setOpenRow] = useState<RetentionRate | null>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const funnelChartRef = useRef<HTMLDivElement>(null);

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

    // Normalize so export is consistent
    const innerW = 960;   // chart drawing area
    const innerH = 300;   // chart height
    svgEl.setAttribute("width", String(innerW));
    svgEl.setAttribute("height", String(innerH));

    // chart SVG (from Reaviz)
    const rawChartSvg = new XMLSerializer().serializeToString(svgEl);
    const chartDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(rawChartSvg)}`;
    const labelCol = 110;
    const totalW = innerW + labelCol;
    const totalH = innerH;

    const compositeSvgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" shape-rendering="geometricPrecision">
  <defs>
    <style>
      @font-face {
        font-family: 'Inter';
        font-weight: 600;
        src: local('Inter'), local('Inter-SemiBold');
      }
      text { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    </style>
  </defs>

  <!-- background -->
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="#FFFFFF" />

  <!-- Vertical axis label, centered relative to the CHART area -->
  <g transform="translate(${Math.round(labelCol * 0.45)} ${totalH / 2}) rotate(-90)">
    <text
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="18"
      font-weight="600"
      fill="#1F2937"
    >
      Number of Clients
    </text>
  </g>

  <!-- The Reaviz chart itself -->
  <image href="${chartDataUri}" x="${labelCol}" y="0" width="${innerW}" height="${innerH}" />
</svg>
`;

    const compositeDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(compositeSvgString)}`;

    const exportContent = (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 20,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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


    // export with Satori
    await exportAsSvg({
      content: exportContent,
      title: `Visits Breakdown, ${dr}`,
      selectedFilters: {},
      width: 1200,
      height: 760,
      filename: `jane-visit-breakdown-${dr.replaceAll(" ", "").replaceAll("/", "-")}`,
      backgroundColor: "#FFFFFF",
    });
  };

  const handleExportPieChart = async () => {
    const dr = dateRange.startDate && dateRange.endDate
      ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
      : "All Data";
    const title = `Visits Breakdown, ${dr}`;

    const container = pieChartRef.current;
    const svgEl = container?.querySelector('svg') as SVGSVGElement | null;
    if (!svgEl) { alert("Pie SVG not found."); return; }

    const pieW = 420, pieH = 420;
    svgEl.setAttribute('width', String(pieW));
    svgEl.setAttribute('height', String(pieH));

    const rawPieSvg = new XMLSerializer().serializeToString(svgEl);
    const pieDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(rawPieSvg)}`;

    const legendData = (pieData.length ? pieData : [
      { key: "Telehealth", data: 39 },
      { key: "Home Visit", data: 32 },
      { key: "In Office", data: 29 },
    ]).map((d, i) => ({ label: d.key, color: chartColors[i % chartColors.length] }));

    const card = (
      <div
        style={{
          width: 400,
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <img
          src={pieDataUri}
          width={280}
          height={280}
          alt="Visits Breakdown"
          style={{ display: "block" }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            flexWrap: "wrap",
            marginTop: -60,
          }}
        >
          {legendData.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: item.color,
                }}
              />
              <span style={{ fontSize: 14, color: "#111827" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );




    await exportAsSvg({
      content: card,
      title,
      selectedFilters: {},
      width: 1200,
      height: 760,
      filename: `jane-visit-breakdown-${dr.replaceAll(" ", "").replaceAll("/", "-")}`,
      backgroundColor: '#FFFFFF',
    });
  };



  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

  const filterData = () => {
    const visitTypeCounts: Record<string, number> = {};
    const filtered = janeData.filter((j) => {
      if (dateRange.startDate && dateRange.endDate) {
        const d = new Date(j.date);
        return d >= dateRange.startDate && d <= dateRange.endDate;
      }
      return true;
    });
    filtered.forEach((j) => {
      const type = j.visitType || "Unknown";
      visitTypeCounts[type] = (visitTypeCounts[type] || 0) + 1;
    });
    const next = Object.entries(visitTypeCounts).map(([key, value]) => ({
      key,
      data: value,
    }));
    setChartData(next.length ? next : defaultVisitChart);
  };





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
    let mounted = true;
    setLoading(true);
    getAllJaneData()
      .then((d) => { if (mounted) setJaneData(d); })
      .catch((err) => { console.error(err); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
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

  const pieData = chartData.length ? chartData : defaultVisitChart;


  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${navBarOpen ? "ml-[250px]" : "ml-[60px]"
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

          {/* remove the side by side flex so they stack */}
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
                  disabled={visitDisplay !== "graph"} // only export when graph tab is active
                  onClick={handleExportPieChart}
                >
                  Export
                </button>
              </div>
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

                  <div className={chartDiv}>
                    <div
                      className="chartContainer"
                      style={{ width: 350, height: 350 }}
                      ref={pieChartRef}
                    >
                      {loading ? <Loading /> : (
                        <PieChart
                          data={pieData}
                          series={<PieArcSeries doughnut={true} colorScheme={chartColors} label={null} />}
                        />
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-4">
                      {pieData.map((item, index) => (
                        <div key={item.key} className="flex items-center gap-2">
                          <div className="w-10 h-4" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
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