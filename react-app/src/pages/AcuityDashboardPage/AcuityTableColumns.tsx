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

const labelWithArrows = (text: string) => (
  <span className="inline-flex items-center gap-1 font-bold">
    {text}
    <span className="inline-flex flex-col leading-none">
      {/* up */}
      <svg width="10" height="9" viewBox="0 0 24 24">
        <path d="M7 14l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* down */}
      <svg width="10" height="9" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  </span>
);

export const trimesterColumns: ColumnDef<TrimesterAttendance>[] = [
  {
    accessorKey: "class",
    header: () => labelWithArrows("CLASS"),
    cell: ({ row }) => <span className="font-bold">{row.getValue("class")}</span>,
  },
  { accessorKey: "category", header: () => labelWithArrows("CATEGORY") },
  { accessorKey: "first", header: () => labelWithArrows("1ST") },
  { accessorKey: "second", header: () => labelWithArrows("2ND") },
  { accessorKey: "third", header: () => labelWithArrows("3RD") },
  { accessorKey: "fourth", header: () => labelWithArrows("4TH") },
  { accessorKey: "fifth", header: () => labelWithArrows("5TH") },
  { accessorKey: "total", header: () => labelWithArrows("TOTAL") },
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
    header: () => labelWithArrows("CLASS"),
    cell: ({ row }) => <span className="font-bold">{row.getValue("class")}</span>,
  },
  { accessorKey: "category", header: () => labelWithArrows("CATEGORY") },
  { accessorKey: "total_attendance", header: () => labelWithArrows("TOTAL ATTENDANCE") },
  { accessorKey: "instructor1_attendance", header: () => labelWithArrows("KAELY HARROD") },
  { accessorKey: "instructor2_attendance", header: () => labelWithArrows("INSTRUCTOR 2") },
];
