import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";

export type ClientTableRow = {
  firstName: string;
  lastName: string;
  email: string;
  acuityClasses: number;
  janeConsults: number;
  rentals: number;
  purchases: number;
  id: string;
};

export const clientListColumns: ColumnDef<ClientTableRow>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          F. Name
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          L. Name
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "acuityClasses",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Acuity Classes
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("acuityClasses");
      return value === 0 ? "N/A" : value;
    },
  },
  {
    accessorKey: "janeConsults",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          JANE Consults
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "rentals",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rentals
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("rentals");
      return value === 0 ? "N/A" : value;
    },
  },
  {
    accessorKey: "purchases",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Purchases
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("purchases");
      return value === 0 ? "N/A" : value;
    },
  },
];
