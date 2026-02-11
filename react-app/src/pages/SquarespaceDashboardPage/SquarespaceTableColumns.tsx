import { ColumnDef } from "@tanstack/react-table";
import ColumnSortButton from "@/components/DataTable/ColumnSortButton";

export type SquarespaceOrder = {
  name: string;
  email: string;
  item: string;
  cost: number;
  date: string;
  channel: string;
  id: string | undefined;
};

export const squarespaceColumns: ColumnDef<SquarespaceOrder>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Name</ColumnSortButton>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Email</ColumnSortButton>;
    },
  },
  {
    accessorKey: "item",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Item</ColumnSortButton>;
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Cost</ColumnSortButton>;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return formatted;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Date</ColumnSortButton>;
    },
    cell: ({ getValue }) =>
      Intl.DateTimeFormat("en-us", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(getValue() as string)),
  },
  {
    accessorKey: "channel",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Channel</ColumnSortButton>;
    },
  },
];
