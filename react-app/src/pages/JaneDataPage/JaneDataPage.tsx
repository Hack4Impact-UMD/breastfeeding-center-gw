import {
  DateRangePicker,
  defaultDateRange,
  defaultPresets,
} from "@/components/DateRangePicker/DateRangePicker.tsx";
import { useJaneData } from "@/hooks/queries/useJaneData.ts";
import { useDeleteJaneRecord } from "@/hooks/mutations/useDeleteJaneRecord.ts";
import FileUploadPopup from "./FileUploadPopup.tsx";
import Loading from "@/components/Loading.tsx";
import NavigationBar from "@/components/NavigationBar/NavigationBar.tsx";
import Header from "@/components/Header.tsx";
import { JaneID } from "@/types/JaneType.ts";
import { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable.tsx";
import { janeIDDataColumns } from "./JaneDataTableColumns.tsx";

const JaneDataPage = () => {
  //styles
  const buttonStyle =
    "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light text-lg border-1 border-black-500 py-2 px-8 rounded-full cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";
  //file upload
  // const [file, setFile] = useState<File | null>(null);
  //
  // const [janeUploadData, setJaneUploadData] = useState<Jane[]>([]);
  //
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const [navBarOpen, setNavBarOpen] = useState(true);
  const { data: janeConsultations, isPending, error } = useJaneData();
  const deleteJaneRecordMutation = useDeleteJaneRecord();

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = e.target.files ? e.target.files[0] : null;
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //     console.log("Selected file:", selectedFile.name);
  //
  //     //translate data into jane types and set local data
  //     try {
  //       const parsedJaneData = await getJaneTypes(e);
  //       console.log("Extracted Jane data:", parsedJaneData);
  //
  //       //add data to firebase
  //       try {
  //         console.log(parsedJaneData);
  //         await addJaneSpreadsheet(parsedJaneData);
  //         console.log("Upload complete!");
  //       } catch (error) {
  //         console.error("Upload error:", error);
  //       }
  //
  //       setJaneUploadData(parsedJaneData);
  //     } catch (error) {
  //       console.error("Error extracting Jane data:", error);
  //     }
  //   }
  // };

  const handleDelete = (rows: JaneID[]) => {
    deleteJaneRecordMutation.mutate(rows);
  };

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
          {
            isPending ? (
              <div className="flex justify-center items-center">
                <Loading />
              </div>
            ) : (
              error ? (
                <div className="flex justify-center items-center p-8">
                  <p className="text-red-600">Failed to load Jane data: {error.message}</p>
                </div>
              )
                : (
                  <DataTable
                    columns={janeIDDataColumns}
                    data={janeConsultations}
                    handleDelete={handleDelete}
                    tableType="janeData"
                  />
                )
            )
          }
          <FileUploadPopup
            isOpen={showUploadPopup}
            onClose={() => setShowUploadPopup(false)}
          />
        </div >
      </div >
    </>
  );
};

export default JaneDataPage;
