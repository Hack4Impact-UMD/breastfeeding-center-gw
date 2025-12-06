import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectDropdownProps = {
  options: string[];
  selected: string;
  onChange: (selected: string) => void;
  className?: string;
};

export default function SelectDropdown({
  options,
  selected,
  onChange,
  className = "",
}: SelectDropdownProps) {
  return (
    <div className="flex justify-center">
      <Select value={selected} onValueChange={(val) => onChange(val)}>
        <SelectTrigger
          className={cn("w-[160px] sm:w-[200px] bg-white", className)}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className={cn(
                "cursor-pointer",
                selected === option
                  ? "bg-bcgw-yellow-dark"
                  : "hover:bg-bcgw-yellow-light",
                className,
              )}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
