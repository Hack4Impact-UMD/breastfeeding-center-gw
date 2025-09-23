import { useEffect, useState } from "react";
import Header from "../../components/Header.tsx";
import NavigationBar from "../../components/NavigationBar/NavigationBar.tsx";
import { Jane, JaneID } from "../../types/JaneType.ts";
import {
  addJaneSpreadsheet,
  getAllJaneData,
  deleteJaneByIds,
} from "../../backend/FirestoreCalls";
import { getJaneTypes } from "../../backend/JaneFunctions";
import { DateTime } from "luxon";
import { janeIDDataColumns } from "../../components/DataTable/Columns.tsx";
import { DataTable } from "../../components/DataTable/DataTable.tsx";
import {
  DateRangePicker,
  defaultDateRange,
  defaultPresets,
} from "../../components/DateRangePicker/DateRangePicker.tsx";
import FileUploadPopup from "./FileUploadPopup"; // NEW import

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

  // NEW: control popup
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
          await addJaneSpreadsheet(parsedJaneData);
          console.log("Upload complete!");
        } catch (error) {
          console.error("Upload error:", error);
        }

        setJaneUploadData(parsedJaneData);
      } catch (error) {
        console.error("Error extracting Jane data:", error);
      }
    }
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

  // NEW: called when popup hits "Upload Data"
  const handleUploadSubmit = (apptFile: File | null, clientFile: File | null) => {
    console.log("Appointment file:", apptFile);
    console.log("Client file:", clientFile);
    // For now just logs. Later: hook into addJaneSpreadsheet like handleFileChange.
  };

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]"
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
        </div>
      </div>

      {/* NEW Popup */}
      <FileUploadPopup
        isOpen={showUploadPopup}
        onClose={() => setShowUploadPopup(false)}
        onSubmit={handleUploadSubmit}
      />
    </>
  );
};

export default JaneDataPage;
