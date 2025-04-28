"use client";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React, { useEffect } from "react";
import { Jane } from "@/types/JaneType";
import DeleteRowPopup from "../DeleteRowPopup";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  GlobalFiltering,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleDelete?: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handleDelete,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({}); // record of indices that are selected
  const [rowsSelected, setRowsSelected] = useState<TData[]>([]);

  //delete row popup
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: { globalFilter, rowSelection },
  });

  useEffect(() => {
    setRowsSelected(
      Object.values(table.getSelectedRowModel().rowsById).map(
        (item) => item.original
      )
    );
  }, [rowSelection]);

  useEffect(() => {
    console.log(rowsSelected);
  }, [rowsSelected]);

  return (
    <>
      <div className="flex items-center gap-5 py-4">
        <button
          className={`${
            rowsSelected.length === 0
              ? "bg-bcgw-gray-light cursor-not-allowed" 
              : "bg-bcgw-yellow-dark cursor-pointer"
          } text-sm border-1 border-black-500 py-2 px-8 rounded-full`}
          disabled={rowsSelected.length === 0}
          onClick={openModal}
        >
          Delete
        </button>
        <div className="w-full max-w-sm items-center gap-1.5">
          <div className="relative">
            <Input
              placeholder="Search"
              value={table.getState().globalFilter ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="w-full rounded-none bg-[#D4D4D4] pr-8 placeholder:text-black focus-visible:ring-1 focus-visible:border-transparent"
            />
            <div className="absolute right-2.5 top-2.5 h-4 w-4">
              <SearchIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="border border-2">
        <Table>
          <TableHeader className="bg-[#0C3D6B33]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : "unselected"}
                  className="data-[state=selected]:bg-gray data-[state=unselected]:bg-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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

      <div className="flex items-center justify-end space-x-2 py-2">
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px] bg-white cursor-pointer">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="right" className="bg-white">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          className={`border border-black w-5 h-5 flex items-center justify-center pb-1 ${
            table.getCanPreviousPage()
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-50"
          }`}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className={`border border-black w-5 h-5 flex items-center justify-center pb-1 ${
            table.getCanNextPage()
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-50"
          }`}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
      </div>
      <DeleteRowPopup
        openModal={isModalOpen}
        onClose={closeModal}
        onConfirm={() => {
          if (handleDelete) {
            handleDelete(rowsSelected);
            setRowSelection({});
            console.log(rowsSelected);
          }
        }}
      />
    </>
  );
}
