import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

type ColumnSortIconProps = {
    sortedState: false | "asc" | "desc";
};

const ColumnSortIcon = ({ sortedState } : ColumnSortIconProps) => {

    return (
        <div>
        {sortedState === false ? (
        <ArrowUpDown className="h-4 w-4 ml-2" />
        ) : sortedState === "desc" ? (
        <ArrowDown className="h-4 w-4 ml-2" />
        ) : (
        <ArrowUp className="h-4 w-4 ml-2" />
        )}
        </div>
    );
} 

export default ColumnSortIcon;