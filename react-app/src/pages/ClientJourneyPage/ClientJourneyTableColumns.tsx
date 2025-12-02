import { ColumnDef } from "@tanstack/react-table";
import { VisitType } from "@/types/JaneType";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { DateTime } from "luxon";

export type AcuityData = {
  class: string | null;
  instructor: string | null;
  date: string;
};

export type JaneConsults = {
  clinician: string;
  date: string;
  service: string;
  visitType: VisitType;
  insurance: string;
};

export type PaySimpleRentals = {
  item: string;
  totalCost: number;
  rate: number;
  startDate: string;
  endDate: string;
  rentalLength: number;
};

export type OneTimePurchase = {
  item: string;
  cost: number;
  date: string;
  platform: string;
};

export type Client = {
  firstName: string;
  lastName: string;
  email: string;
  acuityClasses: number;
  janeConsults: number;
  rentals: number;
  purchases: number;
};

export const acuityColumns: ColumnDef<AcuityData>[] = [
  {
    accessorKey: "class",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Class
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<string | null>("class");
      return value ?? "N/A";
    },
  },
  {
    accessorKey: "instructor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Instructor
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<string | null>("instructor");
      return value ?? "N/A";
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export const janeConsultsColumns: ColumnDef<JaneConsults>[] = [
  {
    accessorKey: "clinician",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clinician
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<string>("date");
      return value === "N/A"
        ? ""
        : DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT);
    },
  },
  {
    accessorKey: "service",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "visitType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Visit Type
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "insurance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Insurance
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export const paysimpleColumns: ColumnDef<PaySimpleRentals>[] = [
  {
    accessorKey: "item",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "totalCost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Cost
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalCost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return formatted;
    },
  },
  {
    accessorKey: "rate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rate
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "rentalLength",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rental Length
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export const oneTimePurchaseColumns: ColumnDef<OneTimePurchase>[] = [
  {
    accessorKey: "item",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cost
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
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
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "platform",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Platform
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export const clientListColumns: ColumnDef<Client>[] = [
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
  },
];
