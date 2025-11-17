import Modal from "../../components/Modal";
import { IoIosClose } from "react-icons/io";
import { RetentionRate, LostClient } from "./JaneTableColumns";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import ColumnSortButton from "@/components/DataTable/ColumnSortButton";

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
      header: ({ column }) => (
        <ColumnSortButton column={column}>First Name</ColumnSortButton>
      ),
      cell: ({ row }) => (
        <span className="cursor-pointer">{row.getValue("first")}</span>
      ),
    },
    {
      accessorKey: "last",
      header: ({ column }) => (
        <ColumnSortButton column={column}>Last Name</ColumnSortButton>
      ),
      cell: ({ row }) => (
        <span className="cursor-pointer">{row.getValue("last")}</span>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <ColumnSortButton column={column}>Email</ColumnSortButton>
      ),
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
      <div className="flex flex-col h-full relative">
        <div className="flex justify-between items-center my-2 mx-4">
          <p className="text-lg">Clients Lost After {openRow.visit}</p>
          <button
            onClick={handleClose}
            className="text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
            aria-label="Close"
          >
            <IoIosClose size={45} />
          </button>
        </div>

        <div className="w-full h-[1.5px] bg-black" />

        <div className="pt-4 pb-8 px-8">
          <div className="flex justify-end mb-0">
            <Button variant={"outlineGray"} className="rounded-full text-lg">
              Export
            </Button>
          </div>

          <DataTable
            tableType="clientsLost"
            columns={lostClientColumns}
            data={openRow?.clients ?? []}
            pageSize={4}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ClientLostPopup;
