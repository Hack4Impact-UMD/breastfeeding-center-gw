import { useState } from "react";
import Modal from "../../components/Modal";
import { IoIosClose } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RetentionRate, LostClient } from "./JaneTableColumns";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";

type ClientLostPopupMobileProps = {
  openRow: RetentionRate;
  setOpenRow: (row: RetentionRate | null) => void;
};

const ClientLostPopupMobile = ({
  openRow,
  setOpenRow,
}: ClientLostPopupMobileProps) => {
  const handleClose = () => setOpenRow(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const lostClientColumns: ColumnDef<LostClient>[] = [
    { accessorKey: "first", header: "First Name" },
    { accessorKey: "last", header: "Last Name" },
  ];

  const totalRows = openRow?.clients?.length ?? 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData =
    openRow?.clients?.slice(startIndex, startIndex + rowsPerPage) ?? [];

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <Modal
      open={openRow !== null}
      onClose={handleClose}
      width={450}
      // maxWidth={500}
      // responsive
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-5 py-4">
          <p className="text-base font-semibold flex-1">
            Clients Lost After {openRow.visit}
          </p>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 -mr-2"
          >
            <IoIosClose size={36} />
          </button>
        </div>

        <div className="w-full h-[1px] bg-gray-800" />

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex justify-end mb-4">
            <button className="bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-400 py-2 px-6 rounded-full text-sm font-medium transition-colors">
              Export
            </button>
          </div>
          <div className="mb-4">
            <DataTable
              columns={lostClientColumns}
              data={paginatedData}
              tableType="clientsLost"
            />
          </div>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-5 py-4">
            <div className="flex justify-center items-center gap-4">
              <button
                className={`p-2 rounded border border-gray-400 transition-colors ${
                  page === 1
                    ? "opacity-40 cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-100 bg-white"
                }`}
                onClick={handlePrev}
                disabled={page === 1}
              >
                <IoIosArrowBack size={18} />
              </button>

              <span className="text-sm font-medium min-w-[100px] text-center">
                Page {page} of {totalPages}
              </span>

              <button
                className={`p-2 rounded border border-gray-400 transition-colors ${
                  page === totalPages
                    ? "opacity-40 cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-100 bg-white"
                }`}
                onClick={handleNext}
                disabled={page === totalPages}
              >
                <IoIosArrowForward size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ClientLostPopupMobile;
