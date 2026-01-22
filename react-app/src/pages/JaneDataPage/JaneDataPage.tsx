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
import { DataTable } from "@/components/DataTable/DataTable.tsx";
import { janeIDDataColumns } from "./JaneDataTableColumns.tsx";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";

const JaneDataPage = () => {
  // style
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
      <div className="flex flex-col py-14">
        <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center justify-between mb-4">
          <h1 className="w-full font-semibold text-3xl sm:text-4xl lg:text-5xl">
            Jane Uploaded Data
          </h1>
          <div className="flex justify-end">
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
          <Button
            variant={"yellow"}
            className={"rounded-full text-lg py-6 px-8"}
            onClick={() => setShowUploadPopup(true)}
          >
            UPLOAD NEW SPREADSHEETS
          </Button>
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
