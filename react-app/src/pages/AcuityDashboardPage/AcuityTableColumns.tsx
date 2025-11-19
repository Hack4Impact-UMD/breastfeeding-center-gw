import { ColumnDef } from "@tanstack/react-table";
import ColumnSortButton from "@/components/DataTable/ColumnSortButton";

/* ---------- Trimester Attendance ---------- */
export type TrimesterAttendance = {
  class: string;
  category: string;
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifth: number;
  total: number;
};

export const trimesterColumns: ColumnDef<TrimesterAttendance>[] = [
  {
    accessorKey: "class",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Class</ColumnSortButton>;
    },
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("class")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Category</ColumnSortButton>;
    },
  },
  {
    accessorKey: "first",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>1st</ColumnSortButton>;
    },
  },
  {
    accessorKey: "second",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>2nd</ColumnSortButton>;
    },
  },
  {
    accessorKey: "third",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>3rd</ColumnSortButton>;
    },
  },
  {
    accessorKey: "fourth",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>4th</ColumnSortButton>;
    },
  },
  {
    accessorKey: "fifth",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>5th</ColumnSortButton>;
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Total</ColumnSortButton>;
    },
  },
];

/* ---------- Instructor Attendance ---------- */
export type InstructorAttendance = {
  class: string;
  category: string;
  total_attendance: number;
  instructor1_attendance: number;
  instructor2_attendance: number;
};

export const instructorColumns: ColumnDef<InstructorAttendance>[] = [
  {
    accessorKey: "class",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Class</ColumnSortButton>;
    },
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("class")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Category</ColumnSortButton>;
    },
  },
  {
    accessorKey: "total_attendance",
    header: ({ column }) => {
      return (
        <ColumnSortButton column={column}>Total Attendance</ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "instructor1_attendance",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Kaely Harrod</ColumnSortButton>;
    },
  },
  {
    accessorKey: "instructor2_attendance",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Instructor 2</ColumnSortButton>;
    },
  },
];
