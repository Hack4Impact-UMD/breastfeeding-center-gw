import { ColumnDef } from "@tanstack/react-table";

// class attendance by trimester
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
    header: () => <span className="font-bold">CLASS</span>,
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("class")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: () => <span className="font-bold">CATEGORY</span>,
  },
  {
    accessorKey: "first",
    header: () => <span className="font-bold">1ST</span>,
  },
  {
    accessorKey: "second",
    header: () => <span className="font-bold">2ND</span>,
  },
  {
    accessorKey: "third",
    header: () => <span className="font-bold">3RD</span>,
  },
  {
    accessorKey: "fourth",
    header: () => <span className="font-bold">4TH</span>,
  },
  {
    accessorKey: "fifth",
    header: () => <span className="font-bold">5TH</span>,
  },
  {
    accessorKey: "total",
    header: () => <span className="font-bold">TOTAL</span>,
  },
];

// class attendance by instructor popularity
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
    header: () => <span className="font-bold">CLASS</span>,
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("class")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: () => <span className="font-bold">CATEGORY</span>,
  },
  {
    accessorKey: "total_attendance",
    header: () => <span className="font-bold">TOTAL ATTENDANCE</span>,
  },
  {
    accessorKey: "instructor1_attendance",
    header: () => <span className="font-bold">KAELY HARROD</span>,
  },
  {
    accessorKey: "instructor2_attendance",
    header: () => <span className="font-bold">INSTRUCTOR 2</span>,
  },
];
