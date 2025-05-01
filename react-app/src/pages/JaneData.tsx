import { useEffect, useState } from "react";
import Header from "../components/Header.tsx";
import NavigationBar from "../components/NavigationBar/NavigationBar.tsx";
import { JaneID } from "../types/JaneType.ts";
import {
  addJaneSpreadsheet,
  getAllJaneData,
  deleteJaneByIds,
} from "../backend/FirestoreCalls";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { janeIDDataColumns } from "../components/DataTable/Columns.tsx";
import { DataTable } from "../components/DataTable/DataTable.tsx";

const JaneData = () => {
  //styles
  const centerItemsInDiv = "flex justify-between items-center";

  //file upload
  const [file, setFile] = useState<File | null>(null);
  const [janeData, setJaneData] = useState<JaneID[]>([]);
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

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]" //set margin of content to 250px when nav bar is open and 60px when closed
        }`}>
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
