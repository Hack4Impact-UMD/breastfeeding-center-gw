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
    cell: ({ row }) => {
      const className: string = row.getValue("class");

      return (
        <span className="font-bold">
          {className.length > 15 ? className.slice(0, 15) + "..." : className}
        </span>
      );
    },
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
  avgAttendance: number;
  numClasses: number;
  totalAttendance: number;
  instructorNames: string;
  instructors: InstructorData[];
};

export type InstructorData = {
  instructor: string;
  avgAttendance: number;
  numClasses: number;
  totalAttendance: number;
};

export function instructorColumns(
  onOpen: (row: InstructorAttendance) => void,
): ColumnDef<InstructorAttendance>[] {
  return [
    {
      accessorKey: "class",
      header: ({ column }) => {
        return <ColumnSortButton column={column}>Class</ColumnSortButton>;
      },
      cell: ({ row }) => {
        const className: string = row.getValue("class");

        return (
          <span className="font-bold">
            {className.length > 15 ? className.slice(0, 15) + "..." : className}
          </span>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return <ColumnSortButton column={column}>Category</ColumnSortButton>;
      },
    },
    {
      accessorKey: "avgAttendance",
      header: ({ column }) => {
        return (
          <ColumnSortButton column={column}>Avg. Attend.</ColumnSortButton>
        );
      },
    },
    {
      accessorKey: "numClasses",
      header: ({ column }) => {
        return (
          <ColumnSortButton column={column}>Num. Classes</ColumnSortButton>
        );
      },
    },
    {
      accessorKey: "totalAttendance",
      header: ({ column }) => {
        return (
          <ColumnSortButton column={column}>Total Attend.</ColumnSortButton>
        );
      },
    },
    {
      accessorKey: "instructorNames",
      header: ({ column }) => {
        return <ColumnSortButton column={column}>Instructors</ColumnSortButton>;
      },
      cell: ({ row }) => {
        const r = row.original as InstructorAttendance;
        const hasInstructors = (r.instructors?.length ?? 0) > 0;

        if (!hasInstructors)
          return (
            <span className="text-gray-900 text-center w-full block">N/A</span>
          );

        return (
          <button
            title={r.instructorNames}
            onClick={() => onOpen(r)}
            className="w-56 sm:w-64 truncate border rounded-full px-3 py-1 text-sm font-medium
                       bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light cursor-pointer"
          >
            {r.instructorNames}
          </button>
        );
      },
    },
  ] as ColumnDef<InstructorAttendance>[];
}
