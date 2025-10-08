"use client";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { FiTrash } from "react-icons/fi";
import { useEffect, useState } from "react";
import DeleteRowPopup from "./DeleteRowPopup";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleDelete?: (selectedRows: TData[]) => void;
  tableType: string;
  tableHeaderExtras?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handleDelete,
  tableType,
  tableHeaderExtras,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [rowsSelected, setRowsSelected] = useState<TData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: { globalFilter, rowSelection, sorting },
  });

  useEffect(() => {
    setRowsSelected(
      Object.values(table.getSelectedRowModel().rowsById).map(
        (item) => item.original
      )
    );
  }, [rowSelection]);

  return (
    <>
      <div className="flex justify-between items-center my-3 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {tableType === "janeData" && (
            <button
              className={`${
                rowsSelected.length === 0
                  ? "bg-bcgw-gray-light cursor-not-allowed"
                  : "bg-bcgw-yellow-dark cursor-pointer hover:bg-bcgw-yellow-light"
              } text-base border border-black py-1.5 font-bold px-6 rounded-[10px]`}
              disabled={rowsSelected.length === 0}
              onClick={openModal}
            >
              <div className="flex items-center gap-2">
                <FiTrash /> Delete
              </div>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {(tableType === "clientList" || tableType === "janeData") && (
            <div className="flex items-center w-full max-w-sm border bg-bcgw-gray-light p-1.5">
              <input
                type="text"
                className="flex-grow border-none outline-none bg-bcgw-gray-light"
                value={table.getState().globalFilter ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                placeholder="Search"
              />
              <span className="text-bcgw-gray-dark">
                <SearchIcon className="h-4 w-4" />
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="border-2 rounded-none overflow-hidden">
        <Table>
          <TableHeader
            className={`${
              tableType === "janeData" || tableType === "default"
                ? "bg-[#0C3D6B33]"
                : "bg-[#B9C4CE]"
            }`}
          >
            {tableHeaderExtras && (
              <TableRow>
                <TableHead colSpan={columns.length} className="p-2">
                  {tableHeaderExtras}
                </TableHead>
              </TableRow>
            )}

            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="align-left p-0">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => {
                    if (tableType === "clientList") {
                      navigate("/clients/journey");
                    }
                  }}
                  data-state={row.getIsSelected() ? "selected" : "unselected"}
                  className="group data-[state=selected]:bg-gray-200 data-[state=unselected]:bg-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${
                        tableType === "clientList"
                          ? "cursor-pointer group-hover:bg-gray-300 transition-colors"
                          : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination (unchanged) */}
      {table.getCoreRowModel().rows.length >= 10 && (
        <div className="flex items-center justify-end space-x-2 py-3">
          <div className="flex items-center gap-2">
            <button
              className={`border border-black w-8 h-8 flex items-center justify-center pb-1 ${
                table.getCanPreviousPage()
                  ? "cursor-pointer hover:bg-bcgw-gray-light"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className={`border border-black w-8 h-8 flex items-center justify-center pb-1 ${
                table.getCanNextPage()
                  ? "cursor-pointer hover:bg-bcgw-gray-light"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
          </div>
        </div>
      )}

      <DeleteRowPopup
        openModal={isModalOpen}
        onClose={closeModal}
        onConfirm={() => {
          if (handleDelete) {
            handleDelete(rowsSelected);
            setRowSelection({});
          }
        }}
      />
    </>
  );
}
