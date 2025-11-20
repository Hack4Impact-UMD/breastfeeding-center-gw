import { ColumnDef } from "@tanstack/react-table";
import ColumnSortButton from "@/components/DataTable/ColumnSortButton";

export type ClientTableRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  acuityClasses: number | "N/A";
  janeConsults: number | "N/A";
  rentals: number | "N/A";
  purchases: number | "N/A";
};

export const clientListColumns: ColumnDef<ClientTableRow>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>F. Name</ColumnSortButton>;
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>L. Name</ColumnSortButton>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Email</ColumnSortButton>;
    },
  },
  {
    accessorKey: "acuityClasses",
    header: ({ column }) => {
      return (
        <ColumnSortButton column={column}>Acuity Classes</ColumnSortButton>
      );
    },
    cell: ({ row }) => {
      return row.getValue<number | "N/A">("acuityClasses");
    },
  },
  {
    accessorKey: "janeConsults",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Jane Consults</ColumnSortButton>;
    },
    cell: ({ row }) => {
      return row.getValue<number | "N/A">("janeConsults");
    },
  },
  {
    accessorKey: "rentals",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Rentals</ColumnSortButton>;
    },
    cell: ({ row }) => {
      return row.getValue<number | "N/A">("rentals");
    },
  },
  {
    accessorKey: "purchases",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Purchases</ColumnSortButton>;
    },
    cell: ({ row }) => {
      return row.getValue<number | "N/A">("purchases");
    },
  },
];
