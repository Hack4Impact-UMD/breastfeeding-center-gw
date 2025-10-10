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

export type LostClient = { first: string; last: string; email: string };

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
    header: () => <span className="font-bold">Percent</span>,
    cell: ({ row }) => {
      const value = row.getValue<number>("percent");
      return `${value}%`;
    },
  },
  {
    accessorKey: "count",
    header: () => <span className="font-bold">Count</span>,
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
  clientsLostNames: string;
  clients?: LostClient[];
};
export function makeRetentionRateColumns(
  onOpen: (row: RetentionRate) => void,
): ColumnDef<RetentionRate>[] {
  return [
    {
      accessorKey: "visit",
      header: () => <span className="font-bold">Visits</span>,
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("visit")}</span>
      ),
    },
    {
      accessorKey: "numberVisited",
      header: () => <span className="font-bold">Number Visited</span>,
    },
    {
      accessorKey: "percent",
      header: () => <span className="font-bold">Percent</span>,
      cell: ({ row }) => `${row.getValue<number>("percent")}%`,
    },
    {
      // compute from clients so it always matches the chip count
      accessorKey: "loss",
      header: () => <span className="font-bold">Loss</span>,
      cell: ({ row }) => row.original.clients?.length ?? 0,
    },
    {
      accessorKey: "clientsLostNames",
      header: () => <span className="font-bold">Clients Lost</span>,
      cell: ({ row }) => {
        const r = row.original as RetentionRate;
        const hasClients = (r.clients?.length ?? 0) > 0;

        if (!hasClients)
          return (
            <span className="text-gray-900 text-center w-full block">N/A</span>
          );

        return (
          <button
            title={r.clientsLostNames}
            onClick={() => onOpen(r)}
            className="w-56 sm:w-64 truncate rounded-full px-3 py-1 text-sm font-medium
                       bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light cursor-pointer"
          >
            {r.clientsLostNames}
          </button>
        );
      },
    },
  ];
}
