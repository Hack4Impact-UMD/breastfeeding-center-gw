import { ColumnDef } from "@tanstack/react-table";

/** Same header as Jane (static ⇅, click toggles sorting) */
const headerButton = (title: string, column: any) => (
  <button
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="flex items-center gap-2 px-1 py-2 w-full text-left hover:opacity-90"
    aria-label={`Sort by ${title}`}
    type="button"
  >
    <span className="font-bold">{title}</span>
    <span className="text-sm">⇅</span>
  </button>
);

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
    header: ({ column }) => headerButton("CLASS", column),
    cell: ({ row }) => <span className="font-bold">{row.getValue("class")}</span>,
  },
  { accessorKey: "category", header: ({ column }) => headerButton("CATEGORY", column) },
  { accessorKey: "first", header: ({ column }) => headerButton("1ST", column) },
  { accessorKey: "second", header: ({ column }) => headerButton("2ND", column) },
  { accessorKey: "third", header: ({ column }) => headerButton("3RD", column) },
  { accessorKey: "fourth", header: ({ column }) => headerButton("4TH", column) },
  { accessorKey: "fifth", header: ({ column }) => headerButton("5TH", column) },
  { accessorKey: "total", header: ({ column }) => headerButton("TOTAL", column) },
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
    header: ({ column }) => headerButton("CLASS", column),
    cell: ({ row }) => <span className="font-bold">{row.getValue("class")}</span>,
  },
  { accessorKey: "category", header: ({ column }) => headerButton("CATEGORY", column) },
  { accessorKey: "total_attendance", header: ({ column }) => headerButton("TOTAL ATTENDANCE", column) },
  { accessorKey: "instructor1_attendance", header: ({ column }) => headerButton("KAELY HARROD", column) },
  { accessorKey: "instructor2_attendance", header: ({ column }) => headerButton("INSTRUCTOR 2", column) },
];
