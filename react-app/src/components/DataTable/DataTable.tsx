"use client";
import { useNavigate } from "react-router-dom";
import { SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Button } from "../ui/button";
import { ClientTableRow } from "@/pages/ClientListPage/ClientListTableColumns";
import { useAuth } from "@/auth/AuthProvider";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleDelete?: (selectedRows: TData[]) => void;
  tableType: string;
  tableHeaderExtras?: React.ReactNode;
  pageSize?: number;
  paginate?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handleDelete,
  tableType,
  tableHeaderExtras,
  pageSize = 10,
  paginate = true,
}: DataTableProps<TData, TValue>) {
  const auth = useAuth();
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
    state: {
      globalFilter,
      rowSelection,
      sorting,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const [pageInput, setPageInput] = useState<string>(
    String(table.getState().pagination.pageIndex + 1),
  );

  useEffect(() => {
    setPageInput(String(table.getState().pagination.pageIndex + 1));
  }, [table.getState().pagination.pageIndex]);

  useEffect(() => {
    setRowsSelected(
      Object.values(table.getSelectedRowModel().rowsById).map(
        (item) => item.original,
      ),
    );
  }, [rowSelection, table]);

  return (
    <>
      <div
        className={
          tableType === "janeData"
            ? "flex my-3 flex-wrap gap-4"
            : "flex my-3 flex-wrap"
        }
      >
        {tableType === "janeData" &&
          auth.token?.claims?.role !== "VOLUNTEER" && (
            <div className="flex items-center gap-4">
              <Button
                variant={"yellow"}
                className={"rounded-lg text-sm flex items-center gap-2"}
                disabled={rowsSelected.length === 0}
                onClick={openModal}
                aria-label="Delete selected rows"
              >
                <FiTrash /> Delete
              </Button>
            </div>
          )}

        <div
          className={
            tableType === "janeData"
              ? "flex items-center gap-3 w-[80%]"
              : "flex items-center gap-3 w-full"
          }
        >
          {(tableType === "clientList" || tableType === "janeData") && (
            <div className="flex items-center w-full max-w-sm border bg-bcgw-gray-light p-1.5">
              <input
                type="text"
                className="flex-grow border-none min-w-0 outline-none bg-bcgw-gray-light"
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
        {tableHeaderExtras && (
          <div className="p-2 w-full bg-[#0C3D6B33] border-b">
            {tableHeaderExtras}
          </div>
        )}

        <Table>
          <TableHeader
            className={`${
              tableType === "janeData" ||
              tableType === "default" ||
              tableType === "clientsLost"
                ? "bg-[#0C3D6B33]"
                : "bg-[#B9C4CE]"
            }`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="align-left p-0">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const client = row.original as ClientTableRow;

                return (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      if (tableType === "clientList") {
                        navigate(`/clients/journey/${client.id}`);
                      }
                    }}
                    data-state={row.getIsSelected() ? "selected" : "unselected"}
                    className="group data-[state=selected]:bg-gray-200 data-[state=unselected]:bg-white"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`${
                          tableType === "clientList" ||
                          tableType === "clientsLost"
                            ? "cursor-pointer group-hover:bg-gray-300 transition-colors"
                            : ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
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

      {/* pagination */}
      {paginate && table.getPageCount() > 1 && (
        <div className="flex items-center justify-end py-3">
          <div className="flex items-center mr-6">
            <span className="mr-4 text-base font-medium">Page</span>
            <div className="mr-3">
              <input
                type="text"
                aria-label="Page number"
                value={pageInput}
                disabled={table.getPageCount() <= 1}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  setPageInput(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const requested = Number(pageInput);
                    const total = table.getPageCount();
                    if (
                      Number.isInteger(requested) &&
                      requested >= 1 &&
                      requested <= total
                    ) {
                      table.setPageIndex(requested - 1);
                    } else {
                      setPageInput(
                        String(table.getState().pagination.pageIndex + 1),
                      );
                    }
                  }
                }}
                onBlur={() => {
                  const requested = Number(pageInput);
                  const total = table.getPageCount();
                  if (
                    Number.isInteger(requested) &&
                    requested >= 1 &&
                    requested <= total
                  ) {
                    table.setPageIndex(requested - 1);
                  } else {
                    setPageInput(
                      String(table.getState().pagination.pageIndex + 1),
                    );
                  }
                }}
                className={`border-2 border-black w-8 h-8 text-center focus:outline-none focus:ring-2 focus:ring-[#0C3D6B] ${
                  table.getPageCount() <= 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>
            <span className="text-base">of {table.getPageCount()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className={`rounded-none w-8 h-8 flex items-center justify-center border-2 ${
                table.getCanPreviousPage()
                  ? "border-black text-[#222] cursor-pointer"
                  : "border-gray-300 text-gray-300 cursor-not-allowed"
              }`}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft
                size={14}
                className={
                  table.getCanPreviousPage() ? "text-[#222]" : "text-gray-300"
                }
              />
            </Button>
            <Button
              variant="ghost"
              className={`rounded-none w-8 h-8 flex items-center justify-center border-2 ${
                table.getCanNextPage()
                  ? "border-black text-[#222] cursor-pointer"
                  : "border-gray-300 text-gray-300 cursor-not-allowed"
              }`}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight
                size={14}
                className={
                  table.getCanNextPage() ? "text-[#222]" : "text-gray-300"
                }
              />
            </Button>
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
