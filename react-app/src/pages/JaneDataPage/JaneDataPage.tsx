import {
  DateRangePicker,
  defaultDateRange,
  defaultPresets,
} from "@/components/DateRangePicker/DateRangePicker.tsx";
import { useJaneData } from "@/hooks/queries/useJaneData.ts";
import { useDeleteJaneRecord } from "@/hooks/mutations/useDeleteJaneRecord.ts";
import FileUploadPopup from "./FileUploadPopup.tsx";
import Loading from "@/components/Loading.tsx";
import { JaneTableRow } from "@/types/JaneType.ts";
//import { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable.tsx";
import { janeIDDataColumns } from "./JaneDataTableColumns.tsx";
import { DateRange } from "react-day-picker";
import { useState } from "react";
const JaneDataPage = () => {
  // styles
  const buttonStyle =
    "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light text-lg border-1 border-black-500 py-2 px-8 rounded-full cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";

  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );

  const {
    data: janeConsultations,
    isPending,
    error,
  } = useJaneData(dateRange?.from?.toISOString(), dateRange?.to?.toISOString());

  const deleteJaneRecordMutation = useDeleteJaneRecord();

  const handleDelete = (rows: JaneTableRow[]) => {
    deleteJaneRecordMutation.mutate({
      rows,
      startDate: dateRange?.from?.toISOString(),
      endDate: dateRange?.to?.toISOString(),
    });
  };


  return (
    <>
      <div className="flex flex-col px-10 py-6 sm:p-8 sm:px-20 w-full">
        <div className="relative block md:hidden">
          <h1 className="mt-15 font-bold text-[30px] leading-tight">
            JANE Uploaded Data
          </h1>
          <div className="absolute top-0 right-[12px]">
            <div className="w-[220px] h-[45px]">
              <DateRangePicker
                enableYearNavigation
                value={dateRange}
                onChange={(range) => setDateRange(range)}
                presets={defaultPresets}
                className="w-[220px] h-[45px]"
              />
            </div>
          </div>
        </div>

        {/* DESKTOP HEADER (md+): inline title + picker, no absolute positioning */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <h1 className="font-bold text-[60px] leading-tight">
            JANE Uploaded Data
          </h1>
          <div className="w-60">
            <DateRangePicker
              enableYearNavigation
              value={dateRange}
              onChange={(range) => setDateRange(range)}
              presets={defaultPresets}
              className="w-60"
            />
          </div>
        </div>

        {/* UPLOAD BUTTON */}
        <div className={`${centerItemsInDiv} basis-20xs mt-4 mb-4`}>
          <button
            className={`${buttonStyle} mr-5 text-nowrap`}
            onClick={() => setShowUploadPopup(true)}
          >
            UPLOAD NEW SPREADSHEETS
          </button>
        </div>


        <FileUploadPopup
          isOpen={showUploadPopup}
          onClose={() => setShowUploadPopup(false)}
        />


        {/* DATA TABLE OR LOADING */}
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
            pageSize={10}
          />
        )}
      </div>
    </>
  );
};

export default JaneDataPage;
