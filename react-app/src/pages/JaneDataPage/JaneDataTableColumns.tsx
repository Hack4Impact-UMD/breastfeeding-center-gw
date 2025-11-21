import { JaneTableRow } from "@/types/JaneType";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DateTime } from "luxon";
import ColumnSortButton from "@/components/DataTable/ColumnSortButton";

export const janeDataColumns: ColumnDef<JaneTableRow>[] = [
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
        className="cursor-pointer rounded-none pl-0 ml-2"
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
    accessorKey: "startAt",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Visit</ColumnSortButton>;
    },
    cell: ({ row }) => {
      const value = row.getValue<string>("startAt");
      const dt = DateTime.fromISO(value);
      return dt.isValid ? dt.toLocaleString(DateTime.DATETIME_SHORT) : value;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Email</ColumnSortButton>;
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>F. Name</ColumnSortButton>;
    },
  },
  {
    accessorKey: "middleName",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>M. Initial</ColumnSortButton>;
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>L. Name</ColumnSortButton>;
    },
  },
  {
    accessorKey: "dob",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>DOB</ColumnSortButton>;
    },
    cell: ({ row }) => {
      const value = row.getValue<string>("dob");
      return value === "N/A"
        ? ""
        : DateTime.fromISO(value).toLocaleString(DateTime.DATE_SHORT);
    },
  },
  {
    accessorKey: "service",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Visit Type</ColumnSortButton>;
    },
  },
  {
    accessorKey: "insurance",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Insurance</ColumnSortButton>;
    },
  },
];

export const janeIDDataColumns: ColumnDef<JaneTableRow>[] =
  janeDataColumns as ColumnDef<JaneTableRow>[];
