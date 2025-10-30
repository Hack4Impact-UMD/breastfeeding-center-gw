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
import { JaneTableRow } from "@/types/JaneType.ts";
import { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable.tsx";
import { janeIDDataColumns } from "./JaneDataTableColumns.tsx";
import { DateRange } from "react-day-picker";
import { DateTime } from "luxon";

const JaneDataPage = () => {
  //styles
  const buttonStyle =
    "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light text-lg border-1 border-black-500 py-2 px-8 rounded-full cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";

  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [navBarOpen, setNavBarOpen] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: DateTime.now().minus({ months: 2 }).toJSDate(),
    to: DateTime.now().toJSDate()
  })
  const { data: janeConsultations, isPending, error } = useJaneData(dateRange?.from?.toISOString(), dateRange?.to?.toISOString());
  const deleteJaneRecordMutation = useDeleteJaneRecord();

  const handleDelete = (rows: JaneTableRow[]) => {
    deleteJaneRecordMutation.mutate({ rows, startDate: dateRange?.from?.toISOString(), endDate: dateRange?.to?.toISOString() });
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
                value={dateRange}
                className="w-60"
                onChange={setDateRange}
              />
            </div>
          </div>

          {/*upload section*/}
          <div className={`${centerItemsInDiv} basis-20xs mt-6 mb-4`}>
            <div className={centerItemsInDiv}>
              <button
                className={`${buttonStyle} mr-5 text-nowrap`}
                onClick={() => setShowUploadPopup(true)}
              >
                UPLOAD NEW SPREADSHEETS
              </button>
            </div>
          </div>
          {isPending ? (
            <div className="flex justify-center items-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center p-8">
              <p className="text-red-600">
                Failed to load Jane data: {error.message}
              </p>
            </div>
          ) : (
            <DataTable
              columns={janeIDDataColumns}
              data={janeConsultations}
              handleDelete={handleDelete}
              tableType="janeData"
            />
          )}
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
