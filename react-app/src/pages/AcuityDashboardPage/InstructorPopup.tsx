import Modal from "@/components/Modal";
import { IoIosClose } from "react-icons/io";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import ColumnSortButton from "@/components/DataTable/ColumnSortButton";

import { InstructorAttendance, InstructorData } from "./AcuityTableColumns";
import { exportCsv } from "@/lib/tableExportUtils";

type InstructorPopupProps = {
  openRow: InstructorAttendance | null;
  setOpenRow: (row: InstructorAttendance | null) => void;
};

const InstructorPopup = ({ openRow, setOpenRow }: InstructorPopupProps) => {
  const handleClose = () => {
    setOpenRow(null);
  };

  const instructorColumns: ColumnDef<InstructorData>[] = [
    {
      accessorKey: "instructor",
      header: ({ column }) => (
        <ColumnSortButton column={column}>Instructor</ColumnSortButton>
      ),
      cell: ({ row }) => row.getValue("instructor"),
    },
    {
      accessorKey: "avgAttendance",
      header: ({ column }) => (
        <ColumnSortButton column={column}>Avg. Attend.</ColumnSortButton>
      ),
      cell: ({ row }) => row.getValue("avgAttendance"),
    },
    {
      accessorKey: "numClasses",
      header: ({ column }) => (
        <ColumnSortButton column={column}>Num. Classes</ColumnSortButton>
      ),
      cell: ({ row }) => row.getValue("numClasses"),
    },
    {
      accessorKey: "totalAttendance",
      header: ({ column }) => (
        <ColumnSortButton column={column}>Total Attend.</ColumnSortButton>
      ),
      cell: ({ row }) => row.getValue("totalAttendance"),
    },
  ];

  return (
    <Modal
      open={openRow !== null}
      onClose={handleClose}
      height={425}
      width={600}
    >
      <div className="flex flex-col h-full relative">
        <div className="flex justify-between items-center my-2 mx-4">
          <p className="text-lg">Instructor Data for {openRow?.class}</p>
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
            <Button variant={"outlineGray"} className="rounded-full text-lg"
              onClick={() => exportCsv(openRow?.instructors ?? [], `acuity_instructors_${openRow?.class}`)}
            >
              Export
            </Button>
          </div>

          <DataTable
            tableType="default"
            columns={instructorColumns}
            data={openRow?.instructors ?? []}
            pageSize={5}
          />
        </div>
      </div>
    </Modal>
  );
};

export default InstructorPopup;
