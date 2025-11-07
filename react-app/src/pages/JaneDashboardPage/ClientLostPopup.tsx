import Modal from "../../components/Modal";
import { IoIosClose } from "react-icons/io";
import { RetentionRate, LostClient } from "./JaneTableColumns";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";

type ClientLostPopupProps = {
  openRow: RetentionRate;
  setOpenRow: (row: RetentionRate | null) => void;
};

const ClientLostPopup = ({ openRow, setOpenRow }: ClientLostPopupProps) => {
  const handleClose = () => {
    setOpenRow(null);
  };

  const lostClientColumns: ColumnDef<LostClient>[] = [
    {
      accessorKey: "first",
      header: "First Name",
      cell: ({ row }) => (
        <span className="cursor-pointer">{row.getValue("first")}</span>
      ),
    },
    {
      accessorKey: "last",
      header: "Last Name",
      cell: ({ row }) => (
        <span className="cursor-pointer">{row.getValue("last")}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="cursor-pointer">{row.getValue("email")}</span>
      ),
    },
  ];

  return (
    <Modal
      open={openRow !== null}
      onClose={handleClose}
      height={425}
      width={500}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center m-2">
          <p className="text-lg">Clients Lost After {openRow.visit}</p>
          <button
            onClick={() => {
              handleClose();
            }}
            className="absolute top-0.25 right-0.25 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
          >
            <IoIosClose size={40} />
          </button>
        </div>

        <div className="w-full h-[1.5px] bg-black" />

        <div className="p-4">
          {/* Export button row */}
          <div className="flex justify-end mb-0">
            <button className="bg-transparent hover:bg-bcgw-gray-lighter text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer">
              Export
            </button>
          </div>

          <div className="mt-0 flex flex-col">
            <DataTable
              tableType="clientsLost"
              columns={lostClientColumns}
              data={openRow?.clients ?? []}
              pageSize={5}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ClientLostPopup;
