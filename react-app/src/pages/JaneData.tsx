import { useEffect, useState } from "react";
import Header from "../components/header.tsx";
import NavigationBar from "../components/NavigationBar/NavigationBar.tsx";
import home from "../assets/management.svg";
import React from "react";
import { PieArcSeries, PieChart, FunnelChart } from "reaviz";
import { Jane, JaneID } from "../types/JaneType.ts";
import { getJaneTypes } from "../backend/JaneFunctions";
import {
  addJaneSpreadsheet,
  getAllJaneData,
  deleteJaneByIds,
} from "../backend/FirestoreCalls";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import Loading from "../components/Loading.tsx";
import {
  janeDataColumns,
  janeIDDataColumns,
  acuityColumns,
  AcuityData,
} from "../components/DataTable/Columns.tsx";
import { DataTable } from "../components/DataTable/DataTable.tsx";

const JaneData = () => {
  //styles
  const buttonStyle =
    "bg-bcgw-yellow-dark text-lg border-1 border-black-500 py-2 px-8 rounded-full cursor-pointer";
  const transparentYellowButtonStyle =
    "bg-transparent text-bcgw-yellow-dark border-2 border-bcgw-yellow-dark py-1 px-2 rounded-full cursor-pointer";
  const transparentGrayButtonStyle =
    "bg-transparent text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";

  //file upload
  const [file, setFile] = useState<File | null>(null);
  const [janeData, setJaneData] = useState<JaneID[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [navBarOpen, setNavBarOpen] = useState(true);

  useEffect(() => {
    const fetchJaneData = async () => {
      try {
        const data = await getAllJaneData();
        setJaneData(data);
      } catch (error) {
        console.error("Failed to fetch Jane data:", error);
      }
    };

    fetchJaneData();
  }, []);

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

    // setChartData(chartData);
  };

  const handleDelete = async (rows: JaneID[]) => {
    try {
      const ids = rows.map((entry) => entry.id);
      await deleteJaneByIds(ids);
      const updatedData = await getAllJaneData();
      setJaneData(updatedData);
    } catch (error) {
      console.error("Failed to delete Jane entry:", error);
    }
  };

  const sampleJaneData: JaneID[] = [
    {
      id: "X",
      apptId: "10000",
      firstName: "Jane",
      lastName: "Doe",
      email: "email@gmail.com",
      visitType: "HOMEVISIT",
      treatment: "Lactation Appt, NW DC",
      insurance: "Insurance",
      date: "2025-01-01T16:00:00.000Z",
      babyDob: "2026-01-01",
    },
    {
      id: "X",
      apptId: "20000",
      firstName: "Janet",
      lastName: "Doe",
      email: "email@gmail.com",
      visitType: "OFFICE",
      treatment: "Lactation Appt, NW DC",
      insurance: "Insurance",
      date: "2025-01-08T05:00:00.000Z",
      babyDob: "2026-01-01",
    },
    {
      id: "X",
      apptId: "30000",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Jackie",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Lactation Appt, NW DC",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "40000",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Janice",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Lactation Appt, NW DC",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "50000",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Jennifer",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "60000",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Janette",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "70000",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Jenny",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "80000",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Jasmine",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "90000",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Allison",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "100000",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Amanda",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Avery",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Anna",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Abby",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      id: "X",
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Ally",
      insurance: "Insurance",
      lastName: "Doe",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
  ];

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      {/* <div className="flex flex-col min-h-screen w-full p-8 pr-20 pl-14 bg-gray-200"> */}
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
              <h1 className="font-bold">JANE Uploaded Data</h1>
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

          <DataTable
            columns={janeIDDataColumns}
            data={janeData}
            handleDelete={handleDelete}
            tableType="janeData"
          />
        </div>
      </div>
    </>
  );
};

export default JaneData;
