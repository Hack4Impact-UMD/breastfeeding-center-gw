import { useEffect, useState } from "react";
import Header from "../components/header.tsx";
import NavigationBar from "../components/NavigationBar/NavigationBar.tsx";
import home from "../assets/management.svg";
import React from "react";
import { PieArcSeries, PieChart, FunnelChart } from "reaviz";
import { Jane } from "../types/JaneType.ts";
import { getJaneTypes } from "../backend/JaneFunctions";
import {
  addJaneSpreadsheet,
  getAllJaneData,
  deleteJaneById,
} from "../backend/FirestoreCalls";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import Loading from "../components/Loading.tsx";
import {
  janeDataColumns,
  acuityColumns,
  AcuityData,
} from "../components/DataTable/Columns.tsx";
import { DataTable } from "../components/DataTable/DataTable.tsx";
import { ClientJourneyTable } from "@/components/DataTable/ClientJourneyTable.tsx";

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
  const [janeData, setJaneData] = useState<Jane[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [navBarOpen, setNavBarOpen] = useState(true);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Selected file:", selectedFile.name);

      //translate data into jane types and set local data
      try {
        const janeData = await getJaneTypes(e);
        console.log("Extracted Jane data:", janeData);

        setJaneData(janeData);
      } catch (error) {
        console.error("Error extracting Jane data:", error);
      }

      //add data to firebase
      // try {
      //   await addJaneSpreadsheet(sampleJaneData);
      //   console.log("Upload complete!");
      // } catch (error) {
      //   console.error("Upload error:", error);
      // }
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

    // setChartData(chartData);
  };

  const sampleAcuityData: AcuityData[] = [
    {
      class: "Class A",
      instructor: "A. Smith",
      date: "3/01/24",
    },
    {
      class: "Class B",
      instructor: "A. Smith",
      date: "3/01/23",
    },
  ];
  const sampleJaneData: Jane[] = [
    {
      apptId: "108685",
      firstName: "Menaka",
      lastName: "Kalaskar",
      email: "email@gmail.com",
      visitType: "HOMEVISIT",
      treatment: "Lactation Appt, NW DC",
      insurance: "DC",
      date: "2025-01-01T16:00:00.000Z",
      babyDob: "2026-01-01",
    },
    {
      apptId: "109461",
      firstName: "Mateo",
      lastName: "Meca Rivera",
      email: "email@gmail.com",
      visitType: "OFFICE",
      treatment: "Postpartum Lactation Appointment",
      insurance: "MD",
      date: "2025-01-08T05:00:00.000Z",
      babyDob: "2026-01-01",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
      treatment: "Prenatal Prep for Lactation",
      visitType: "TELEHEALTH",
    },
    {
      apptId: "107850",
      babyDob: "01/01/2026",
      date: "2025-01-01T18:00:00.000Z",
      email: "email@gmail.com",
      firstName: "Pilar",
      insurance:
        '[{:name=>"BCBS/Carefirst", :number=>"NIW596M84436", :invoice_state=>"unpaid", :claim_state=>"unsubmitted", :claim_id=>8810}]',
      lastName: "Whitaker",
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
              <h1 className="font-bold">JANE Statistics</h1>
              <h2 className="font-[Montserrat]">Dashboard</h2>
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

          <DataTable columns={janeDataColumns} data={sampleJaneData} />
        </div>
      </div>
    </>
  );
};

export default JaneData;
