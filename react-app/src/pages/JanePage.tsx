import { useEffect, useState } from "react";
import Header from "../components/header.tsx";
import NavigationBar from "../components/NavigationBar/NavigationBar.tsx";
import home from "../assets/management.svg";
import React from "react";
import { useRef } from "react";
import {
  PieArcSeries,
  PieChart,
  FunnelChart,
  FunnelAxis,
  FunnelAxisLabel,
  FunnelArc,
} from "reaviz";
import { FunnelSeries } from "reaviz";
import { Jane } from "../types/JaneType.ts";
import { getJaneTypes } from "../backend/JaneFunctions";
import { addJaneSpreadsheet, getAllJaneData } from "../backend/FirestoreCalls";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import Loading from "../components/Loading.tsx";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Label } from "@radix-ui/react-select";

const JanePage = () => {
  //nav bar
  const [navBarOpen, setNavBarOpen] = useState(true);

  //styles
  const buttonStyle =
    "bg-bcgw-yellow-dark text-lg border-1 border-black-500 py-2 px-8 rounded-full cursor-pointer";
  const transparentYellowButtonStyle =
    "bg-transparent text-bcgw-yellow-dark border-2 border-bcgw-yellow-dark py-1 px-2 rounded-full cursor-pointer";
  const transparentGrayButtonStyle =
    "bg-transparent text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";
  const chartDiv =
    "flex flex-col items-center justify-center bg-white border-2 border-black p-5 mt-2 rounded-lg";
  const chartDivContainer = "min-w-[300px] max-w-[50%]";

  //file upload
  const [file, setFile] = useState<File | null>(null);
  const [janeData, setJaneData] = useState<Jane[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<{ key: string; data: number }[]>(
    []
  );
  const pieChartRef = useRef<HTMLDivElement>(null);
  const funnelChartRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Selected file:", selectedFile.name);

      //translate data into jane types and set local data
      try {
        const parsedJaneData = await getJaneTypes(e);
        console.log("Extracted Jane data:", parsedJaneData);

        //add data to firebase
        try {
          console.log(parsedJaneData);
          //await addJaneSpreadsheet(parsedJaneData);
          console.log("Upload complete!");
        } catch (error) {
          console.error("Upload error:", error);
        }

        setJaneData(parsedJaneData);
      } catch (error) {
        console.error("Error extracting Jane data:", error);
      }
    }
  };

  // const sampleJaneData: Jane[] = [
  //   {
  //     apptId: "108681",
  //     firstName: "Menaka",
  //     lastName: "Kalaskar",
  //     email: "email@gmail.com",
  //     visitType: "HOMEVISIT",
  //     treatment: "Lactation Appt, NW DC",
  //     insurance: "DC",
  //     date: "2025-01-01T16:00:00.000Z",
  //     babyDob: "2026-01-01",
  //   },
  //   {
  //     apptId: "109461",
  //     firstName: "Mateo",
  //     lastName: "Meca Rivera",
  //     email: "email@gmail.com",
  //     visitType: "OFFICE",
  //     treatment: "Postpartum Lactation Appointment",
  //     insurance: "MD",
  //     date: "2025-01-08T05:00:00.000Z",
  //     babyDob: "2026-01-01",
  //   },
  //   {
  //     apptId: "107850",
  //     babyDob: "01/01/2026",
  //     date: "2025-01-01T18:00:00.000Z",
  //     email: "email@gmail.com",
  //     firstName: "Pilar",
  //     insurance:
  //       '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
  //     lastName: "Whitaker",
  //     treatment: "Prenatal Prep for Lactation",
  //     visitType: "TELEHEALTH",
  //   },
  // ];

  const funnelData = [
    {
      data: 58,
      key: "1st week",
    },
    {
      data: 43,
      key: "2nd week",
    },
    {
      data: 23,
      key: "3rd week",
    },
    {
      data: 15,
      key: "4th week",
    },
    {
      data: 8,
      key: "5th week",
    },
    {
      data: 5,
      key: "6th week",
    },
  ];

  const handleExport = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string
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
  const handleDateRangeChange = (newRange: DateValueType) => {
    if (newRange && newRange.startDate && newRange.endDate) {
      setDateRange({
        startDate: newRange.startDate,
        endDate: newRange.endDate,
      });
      // filter function here
    } else {
      setDateRange({
        startDate: null,
        endDate: null,
      });
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

  useEffect(() => {
    setLoading(true);
    getAllJaneData().then((janeData) => {
      setJaneData(janeData);
      console.log("jane data loaded");
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
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]" //set margin of content to 250px when nav bar is open and 60px when closed
        }`}
      >
        <Header />
        <div className="flex flex-col p-8 pr-20 pl-14 min-h-screen">
          {/*headings*/}
          <div className={centerItemsInDiv}>
            <div>
              <h1 className="font-bold">JANE</h1>
            </div>
            {/*date picker*/}
            <div className="w-60">
              <Datepicker
                placeholder="Select Date Range"
                showShortcuts={true}
                asSingle={false}
                value={dateRange}
                onChange={handleDateRangeChange}
                primaryColor={"yellow"}
                displayFormat="MM/DD/YYYY"
              />
            </div>
          </div>
          {/*upload section*/}
          <div className={`${centerItemsInDiv} basis-20xs mt-6`}>
            <div className={centerItemsInDiv}>
              <button
                className={`${buttonStyle} mr-5 text-nowrap`}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                UPLOAD NEW SPREADSHEET
              </button>
              <input
                id="file-input"
                type="file"
                accept=".xlsx, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/*graphs*/}
          <div className="flex flex-wrap gap-8 pt-3">
            <div className="flex-1 min-w-[300px] max-w-[40%]">
              <div className={`${centerItemsInDiv} pt-4`}>
                <button>Graph/Table</button>
                <button
                  className={transparentGrayButtonStyle}
                  onClick={() => handleExport(pieChartRef, "visit_breakdown")}
                >
                  Export
                </button>
              </div>
              <div className={chartDiv}>
                {/*chart title*/}
                <span className="self-start font-semibold text-xl mb-7">
                  Visit Breakdown:{" "}
                  {dateRange.startDate && dateRange.endDate
                    ? formatDate(dateRange.startDate) +
                      " - " +
                      formatDate(dateRange.endDate)
                    : "All Data"}
                </span>
                {/*chart*/}
                {chartData.length > 0 ? (
                  <div
                    className="chartContainer"
                    ref={pieChartRef}
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
            </div>
            {/*funnel chart*/}
            <div className="flex-1 min-w-[300px] max-w-[60%]">
              <div className={`${centerItemsInDiv} pt-4`}>
                <button>Graph/Table</button>
                <button
                  className={transparentGrayButtonStyle}
                  onClick={() => handleExport(pieChartRef, "visit_breakdown")}
                >
                  Export
                </button>
              </div>
              <div className={chartDiv}>
                <span className="self-start font-semibold text-xl mb-2">
                  Retention Rate:{" "}
                  {dateRange.startDate && dateRange.endDate
                    ? formatDate(dateRange.startDate) +
                      " - " +
                      formatDate(dateRange.endDate)
                    : "All Data"}
                </span>
                <FunnelChart
                  height={290}
                  data={funnelData}
                  series={
                    <FunnelSeries
                      arc={<FunnelArc variant="layered" />}
                      axis={
                        <FunnelAxis
                          label={
                            <FunnelAxisLabel
                              fontSize={10}
                              position="bottom"
                              fill="#000000"
                            />
                          }
                        />
                      }
                    />
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JanePage;
