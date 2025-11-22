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
};

export default function SelectDropdown({
  options,
  selected,
  onChange,
}: SelectDropdownProps) {
  return (
    <div className="flex justify-center self-start pt-6 w-full">
      <Select value={selected} onValueChange={(val) => onChange(val)}>
        <SelectTrigger className="w-[160px] sm:w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white w-[160px] sm:w-[200px]">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className={cn(
                "cursor-pointer",
                selected === option
                  ? "bg-bcgw-yellow-dark"
                  : "hover:bg-bcgw-yellow-light",
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
