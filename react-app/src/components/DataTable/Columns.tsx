"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Jane, VistType } from "@/types/JaneType";
import { Checkbox } from "@/components/ui/checkbox";

export type AcuityData = {
  class: string;
  instructor: string;
  date: string;
};

export type JaneConsults = {
  clinician: string;
  date: string;
  service: string;
  visitType: VistType;
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

export const janeDataColumns: ColumnDef<Jane>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="cursor-pointer rounded-none"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="cursor-pointer rounded-none"
      />
    ),
  },
  {
    accessorKey: "date",
    header: "VISIT",
  },
  {
    accessorKey: "apptId",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorKey: "firstName",
    header: "F. NAME",
  },
  {
    accessorKey: "lastName",
    header: "L. NAME",
  },
  {
    accessorKey: "babyDob",
    header: "DOB",
  },
  {
    accessorKey: "visitType",
    header: "VISIT TYPE",
  },
  {
    accessorKey: "insurance",
    header: "INSURANCE",
  },
];

export const acuityColumns: ColumnDef<AcuityData>[] = [
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];

// clinician: string;
//   date: string;
//   service: string;
//   visitType: VistType;
//   insurance: string;
export const janeConsultsColumns: ColumnDef<JaneConsults>[] = [
  {
    accessorKey: "clinician",
    header: "Clinician",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "visitType",
    header: "Visit Type",
  },
  {
    accessorKey: "insurance",
    header: "Insurance",
  },
];
