import { ColumnDef } from "@tanstack/react-table";

/**
 * Header with static sort icon (⇅)
 * This version does NOT change on sorting.
 */
const headerButton = (title: string, column: any) => {
  return (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center gap-2 px-3 py-2 w-full text-left hover:opacity-90"
      aria-label={`Sort by ${title}`}
      type="button"
    >
      <span className="font-bold">{title}</span>
      <span className="text-sm">⇅</span>
    </button>
  );
};

export type VisitBreakdown = {
  visitType: string;
  percent: number;
  count: number;
};

export const visitBreakdownColumns: ColumnDef<VisitBreakdown>[] = [
  {
    accessorKey: "visitType",
    header: ({ column }) => headerButton("Visit Type", column),
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("visitType")}</span>
    ),
  },
  {
    accessorKey: "percent",
    header: ({ column }) => headerButton("Percentage", column),
    cell: ({ row }) => {
      const value = row.getValue<number>("percent");
      return `${value}%`;
    },
  },
  {
    accessorKey: "count",
    header: ({ column }) => headerButton("Count", column),
    cell: ({ row }) => {
      const value = row.getValue<number>("count");
      return value.toLocaleString();
    },
  },
];

export type RetentionRate = {
  visit: string;
  numberVisited: number;
  percent: number;
  loss: number;
  clientsLost: string;
};

export const retentionRateColumns: ColumnDef<RetentionRate>[] = [
  {
    accessorKey: "visit",
    header: ({ column }) => headerButton("Visits", column),
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("visit")}</span>
    ),
  },
  {
    accessorKey: "numberVisited",
    header: ({ column }) => headerButton("Number Visited", column),
    cell: ({ row }) => row.getValue<number>("numberVisited"),
  },
  {
    accessorKey: "percent",
    header: ({ column }) => headerButton("Percent", column),
    cell: ({ row }) => {
      const value = row.getValue<number>("percent");
      return `${value}%`;
    },
  },
  {
    accessorKey: "loss",
    header: ({ column }) => headerButton("Loss", column),
    cell: ({ row }) => row.getValue<number>("loss"),
  },
  {
    accessorKey: "clientsLost",
    header: ({ column }) => headerButton("Clients Lost", column),
    cell: ({ row }) => row.getValue<string>("clientsLost"),
  },
];
