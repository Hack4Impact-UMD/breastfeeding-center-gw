import { ColumnDef } from "@tanstack/react-table";
import { VisitType } from "@/types/JaneType";
import { DateTime } from "luxon";
import { truncate } from "@/lib/utils";
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ColumnSortButton from "@/components/DataTable/ColumnSortButton";
import { BooqableRental } from "@/services/booqableService";

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

export type OneTimePurchase = {
  item: string;
  cost: number;
  date: string;
  platform: string;
};

export type ClientRow = {
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
        <ColumnSortButton column={column}>
          Class
        </ColumnSortButton>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<string | null>("class");
      return (
        <Tooltip>
          <TooltipTrigger>{value ? truncate(value, 70) : "N/A"}</TooltipTrigger>
          <TooltipContent>{value}</TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "instructor",
    header: ({ column }) => {
      return (
        <ColumnSortButton column={column}>
          Instructor
        </ColumnSortButton>
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
        <ColumnSortButton column={column}>
          Date
        </ColumnSortButton>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<string>("date");
      const dt = DateTime.fromISO(value);
      return dt.isValid ? dt.toLocaleString(DateTime.DATETIME_SHORT) : "N/A";
    },
  },
];

export const janeConsultsColumns: ColumnDef<JaneConsults>[] = [
  {
    accessorKey: "service",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Service
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "clinician",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Clinician
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Date
        </ColumnSortButton>
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
    accessorKey: "visitType",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Visit Type
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "insurance",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Insurance
        </ColumnSortButton>
      );
    },
  },
];

export const booqableColumns: ColumnDef<BooqableRental>[] = [
  {
    accessorKey: "order",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Order #
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Cost
        </ColumnSortButton>
      );
    },
    cell: ({ getValue }) => {
      const amount = getValue() as number / 100;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return formatted;
    },
  },
  {
    accessorKey: "firstPayDate",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          First Payment Date
        </ColumnSortButton>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;
      if (!value) return "N/A";
      const date = new Date(value);
      return isNaN(date.getTime()) ? "N/A" : new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
        timeStyle: "short"
      }).format(date);
    }
  },
  {
    accessorKey: "returnDate",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          End Date
        </ColumnSortButton>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;
      if (!value) return "N/A";
      const date = new Date(value);
      return isNaN(date.getTime()) ? "N/A" : new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
    }
  },
];

export const oneTimePurchaseColumns: ColumnDef<OneTimePurchase>[] = [
  {
    accessorKey: "item",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Item
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Cost
        </ColumnSortButton>
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
        <ColumnSortButton
          column={column}
        >
          Date
        </ColumnSortButton>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;
      if (!value) return "N/A";
      const date = new Date(value);
      return isNaN(date.getTime()) ? "N/A" : new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
    }
  },
  {
    accessorKey: "platform",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Platform
        </ColumnSortButton>
      );
    },
  },
];

export const clientListColumns: ColumnDef<ClientRow>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          F. Name
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          L. Name
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Email
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "acuityClasses",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Acuity Classes
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "janeConsults",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          JANE Consults
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "rentals",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Rentals
        </ColumnSortButton>
      );
    },
  },
  {
    accessorKey: "purchases",
    header: ({ column }) => {
      return (
        <ColumnSortButton
          column={column}
        >
          Purchases
        </ColumnSortButton>
      );
    },
  },
];
