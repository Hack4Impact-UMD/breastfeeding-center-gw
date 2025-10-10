import { Jane, JaneID } from "@/types/JaneType";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import ColumnSortButton from "@/components/DataTable/ColumnSortIcon";

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
    accessorKey: "date",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Visit</ColumnSortButton>;
    },
  },
  {
    accessorKey: "apptId",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>Id</ColumnSortButton>;
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
    accessorKey: "lastName",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>L. Name</ColumnSortButton>;
    },
  },
  {
    accessorKey: "babyDob",
    header: ({ column }) => {
      return <ColumnSortButton column={column}>DOB</ColumnSortButton>;
    },
  },
  {
    accessorKey: "visitType",
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

export const janeIDDataColumns: ColumnDef<JaneID>[] =
  janeDataColumns as ColumnDef<JaneID>[];
