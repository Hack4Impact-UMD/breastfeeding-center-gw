import { ColumnDef } from "@tanstack/react-table";

// visit breakdown
export type VisitBreakdown = {
  visitType: string;
  percent: number;
  count: number;
};

export const visitBreakdownColumns: ColumnDef<VisitBreakdown>[] = [
  {
    accessorKey: "visitType",
    header: () => <span className="font-bold">Visit Type</span>,
    cell: ({ row }) => (
      <span className="font-bold">{row.getValue("visitType")}</span>
    ),
  },
  {
    accessorKey: "percent",
    header: () => <span className="font-bold">PERCENT</span>,
    cell: ({ row }) => {
      const value = row.getValue<number>("percent");
      return `${value}%`;
    },
  },
  {
    accessorKey: "count",
    header: () => <span className="font-bold">COUNT</span>,
    cell: ({ row }) => {
      const value = row.getValue<number>("count");
      return value.toLocaleString();
    },
  },
];

// retention rate table
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
    header: () => <span className="font-bold">PERCENT</span>,
    cell: ({ row }) => {
      const value = row.getValue<number>("percent");
      return `${value}%`;
    },
  },
  {
    accessorKey: "loss",
    header: () => <span className="font-bold">Loss</span>,
  },
  {
    accessorKey: "clientsLost",
    header: () => <span className="font-bold">Clients Lost</span>,
  },
];
