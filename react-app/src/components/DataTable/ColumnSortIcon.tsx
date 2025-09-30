import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Column } from "@tanstack/react-table";

type ColumnSortIconProps<T, V> = {
    sortedState: false | "asc" | "desc";
    column: Column<T, V>
    children?: ReactNode
};

export default function ColumnSortButton<T, V>({ sortedState, children, column }: ColumnSortIconProps<T, V>) {
    return (
        <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {children}
            <div>
                {sortedState === false ? (
                    <ArrowUpDown className="h-4 w-4 ml-2" />
                ) : sortedState === "desc" ? (
                    <ArrowDown className="h-4 w-4 ml-2" />
                ) : (
                    <ArrowUp className="h-4 w-4 ml-2" />
                )}
            </div>
        </Button>
    );
}
