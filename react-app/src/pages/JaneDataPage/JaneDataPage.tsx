import { useEffect, useState } from "react";
import Header from "../../components/Header.tsx";
import NavigationBar from "../../components/NavigationBar/NavigationBar.tsx";
import { Jane, JaneID } from "../../types/JaneType.ts";
import {
  getAllJaneData,
  deleteJaneByIds,
} from "../../backend/FirestoreCalls";
import { DateTime } from "luxon";
import { janeIDDataColumns } from "./JaneDataTableColumns.tsx";
import { DataTable } from "../../components/DataTable/DataTable.tsx";
import FileUploadPopup from "./FileUploadPopup.tsx";
import {
  DateRangePicker,
  defaultDateRange,
  defaultPresets,
} from "@/components/DateRangePicker/DateRangePicker.tsx";

const JaneDataPage = () => {
  //styles
  const buttonStyle =
    "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light text-lg border-1 border-black-500 py-2 px-8 rounded-full cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";

  //file upload
  //@ts-expect-error
  const [file, setFile] = useState<File | null>(null);
  //@ts-expect-error
  const [janeUploadData, setJaneUploadData] = useState<Jane[]>([]);
  const [janeData, setJaneData] = useState<JaneID[]>([]);
  const [navBarOpen, setNavBarOpen] = useState(true);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  useEffect(() => {
    const fetchJaneData = async () => {
      try {
        const data = await getAllJaneData();
        const formattedData = data.map((entry) => ({
          ...entry,
          date: DateTime.fromISO(entry.date).toFormat("f"),
        }));
        setJaneData(formattedData);
      } catch (error) {
        console.error("Failed to fetch Jane data:", error);
      }
    };

    fetchJaneData();
  }, []);

  //date picker
  //@ts-expect-error
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // //setting dates
  // const handleDateRangeChange = (newRange: DateValueType) => {
  //   if (newRange && newRange.startDate && newRange.endDate) {
  //     setDateRange({
  //       startDate: newRange.startDate,
  //       endDate: newRange.endDate,
  //     });
  //     // filter function here
  //   } else {
  //     setDateRange({
  //       startDate: null,
  //       endDate: null,
  //     });
  //   }
  // };

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
        <div className="flex flex-col p-8 pr-20 pl-20">
          {/*headings*/}
          <div className={centerItemsInDiv}>
            <div>
              <h1 className="font-bold">JANE Uploaded Data</h1>
            </div>
            {/*date picker*/}
            <div className="w-60">
              <DateRangePicker
                enableYearNavigation
                defaultValue={defaultDateRange}
                presets={defaultPresets}
                className="w-60"
              />
            </div>
          </div>

          {/*upload section*/}
          <div className={`${centerItemsInDiv} basis-20xs mt-6 mb-4`}>
            <div className={centerItemsInDiv}>
              <button
                className={`${buttonStyle} mr-5 text-nowrap`}
                onClick={() => setShowUploadPopup(true)}>
                UPLOAD NEW SPREADSHEETS
              </button>
            </div>
          </div>

          <DataTable
            columns={janeIDDataColumns}
            data={janeData}
            handleDelete={handleDelete}
            tableType="janeData"
          />

          <FileUploadPopup
        isOpen={showUploadPopup}
        onClose={() => setShowUploadPopup(false)}
      />
        </div>
      </div>
    </>
  );
};

export default JaneDataPage;
