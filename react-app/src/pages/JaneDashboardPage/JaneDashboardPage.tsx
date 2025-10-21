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
} from "reaviz";
import { FunnelSeries } from "reaviz";
import { Jane } from "../../types/JaneType.ts";
import { getAllJaneData } from "../../backend/FirestoreCalls.tsx";
import Loading from "../../components/Loading.tsx";
import { toPng } from "html-to-image";
import download from "downloadjs";
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
  //nav bar
  const [navBarOpen, setNavBarOpen] = useState(true);

  //dropdown
  const [selectedDropdown, setSelectedDropdown] = useState("ALL CLIENTS");

  //styles
  const buttonStyle =
    "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light text-lg border-1 border-black-500 py-2 px-8 rounded-full cursor-pointer";
  const transparentGrayButtonStyle =
    "bg-transparent hover:bg-bcgw-gray-light text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";
  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#CED8E1] hover:shadow-md text-black cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";
  const chartDiv =
    "flex flex-col items-center justify-start bg-white h-[370px] border-2 border-black p-5 mt-5 rounded-lg";

  //file upload
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

  //date picker
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  //setting dates
  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    if (newRange) {
      if (newRange.from && newRange.to) {
        setDateRange({
          startDate: newRange.from,
          endDate: newRange.to,
        });
        filterData();
        // console.log(newRange);
      } else {
        setDateRange({
          startDate: null,
          endDate: null,
        });
      }
    }
  };

  //convert dates to strings for display
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

  const filterData = () => {
    //store count for visitType
    const visitTypeCounts: Record<string, number> = {};
    // filter data by date
    const filteredData = janeData.filter((jane) => {
      if (dateRange.startDate && dateRange.endDate) {
        const appointmentDate = new Date(jane.date);
        return (
          appointmentDate >= dateRange.startDate &&
          appointmentDate <= dateRange.endDate
        );
      }
      return true; //no date selected
    });
    //count number of each visit type
    filteredData.forEach((jane) => {
      const type = jane.visitType || "Unknown";
      visitTypeCounts[type] = (visitTypeCounts[type] || 0) + 1;
    });
    //set number of each visit type for chart
    const chartData = Object.entries(visitTypeCounts).map(([key, value]) => ({
      key,
      data: value,
    }));

    setChartData(chartData);
  };

  //chart colors
  const chartColors = ["#f4bb47", "#05182a", "#3A8D8E"];

  const visitBreakdownData: VisitBreakdown[] = [
    {
      visitType: "Home Visit",
      percent: 16.6,
      count: 150000,
    },
    {
      visitType: "In Office",
      percent: 16.6,
      count: 150000,
    },
    {
      visitType: "Telehealth",
      percent: 66.6,
      count: 600000,
    },
    {
      visitType: "Total",
      percent: 100,
      count: 900000,
    },
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
      // console.log("jane data loaded");
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    filterData();
  }, [janeData]);

  useEffect(() => {
    filterData();
  }, [dateRange]);

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${navBarOpen ? "ml-[250px]" : "ml-[60px]" //set margin of content to 250px when nav bar is open and 60px when closed
          }`}
      >
        <Header />
        <div className="flex flex-col p-8 pr-20 pl-20">
          {/*headings*/}
          <div className={centerItemsInDiv}>
            <h1 className="font-bold">JANE</h1>
            {/*date picker*/}
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

          {/*view uploaded data*/}
          <div className={`${centerItemsInDiv} basis-20xs mt-6`}>
            <Link to="/services/jane/data">
              <button className={`${buttonStyle} mr-5 text-nowrap`}>
                VIEW UPLOADED DATA
              </button>
            </Link>
          </div>

          {/*graphs*/}
          <div className="flex flex-wrap gap-8 pt-3">
            <div className="flex-1 min-w-[300px] max-w-[60%]">
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
                  onClick={() => handleExport(pieChartRef, "visit_breakdown")}
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
            {/*funnel chart*/}
            <div
              className={
                retentionDisplay === "graph"
                  ? "flex-1 min-w-[300px] max-w-[60%]"
                  : ""
              }
            >
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
                  onClick={() => handleExport(funnelChartRef, "retention_rate")}
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
                                    fontSize={12}
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
