"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Jane } from "@/types/JaneType";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Jane>[] = [
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
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="cursor-pointer"
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
