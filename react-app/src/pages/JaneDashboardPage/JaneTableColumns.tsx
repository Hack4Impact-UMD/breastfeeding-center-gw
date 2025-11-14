import { ColumnDef } from "@tanstack/react-table";
import ColumnSortButton from "@/components/DataTable/ColumnSortButton";

export type VisitBreakdown = {
  visitType: string;
  percent: number;
  count: number;
};

export type LostClient = { first: string; last: string; email: string };

export const visitBreakdownColumns: ColumnDef<VisitBreakdown>[] = [
  {
    accessorKey: "visitType",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Visit Type</ColumnSortButton>;
    },
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("visitType")}</span>
    ),
  },
  {
    accessorKey: "percent",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Percent</ColumnSortButton>;
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("percent");
      return `${value}%`;
    },
  },
  {
    accessorKey: "count",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Count</ColumnSortButton>;
    },
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
      header: ({ column }) => {
        return <ColumnSortButton column={column}>Visits</ColumnSortButton>;
      },
      cell: ({ row }) => (
        <span className="font-bold">{row.getValue("visit")}</span>
      ),
    },
    {
      accessorKey: "numberVisited",
      header: ({ column }) => {
        return (
          <ColumnSortButton column={column}>Number Visited</ColumnSortButton>
        );
      },
    },
    {
      accessorKey: "percent",
      header: ({ column }) => {
        return <ColumnSortButton column={column}>Percent</ColumnSortButton>;
      },
      cell: ({ row }) => `${row.getValue<number>("percent")}%`,
    },
    {
      // compute from clients so it always matches the chip count
      accessorKey: "loss",
      header: ({ column }) => {
        return <ColumnSortButton column={column}>Loss</ColumnSortButton>;
      },
      cell: ({ row }) => row.original.clients?.length ?? 0,
    },
    {
      accessorKey: "clientsLostNames",
      header: ({ column }) => {
        return (
          <ColumnSortButton column={column}>Clients Lost</ColumnSortButton>
        );
      },
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
            className="w-56 sm:w-64 truncate border rounded-full px-3 py-1 text-sm font-medium
                       bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light cursor-pointer"
          >
            {r.clientsLostNames}
          </button>
        );
      },
    },
  ];
}
