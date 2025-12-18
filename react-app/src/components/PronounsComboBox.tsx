import { PopoverTrigger } from "@radix-ui/react-popover";
import { Popover, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";

type PronounsComboBoxProps = {
  pronouns: string;
  onChange: (pronouns: string) => void;
  className?: string;
};

export default function PronounsComboBox({
  pronouns,
  onChange,
  className = "",
}: PronounsComboBoxProps) {
  const [isPronounDropdownOpen, setIsPronounDropdownOpen] = useState(false);
  const [pronounQuery, setPronounQuery] = useState("");

  const pronounOptions = [
    {
      value: "She/Her/Hers",
      label: "She/Her/Hers",
    },
    {
      value: "He/Him/His",
      label: "He/Him/His",
    },
    {
      value: "They/Them/Theirs",
      label: "They/Them/Theirs",
    },
  ];

  return (
    <Popover
      open={isPronounDropdownOpen}
      onOpenChange={setIsPronounDropdownOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isPronounDropdownOpen}
          className={cn(
            "w-full sm:w-[175px] justify-between hover:bg-background rounded-2xl mb-4 sm:mb-0",
            className,
          )}
        >
          {pronouns ? pronouns : "Select..."}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-full sm:w-[175px] p-0 bg-white", className)}
      >
        <Command>
          <CommandInput
            placeholder="Search/Add..."
            value={pronounQuery}
            onValueChange={setPronounQuery}
          />
          <CommandList>
            <CommandGroup>
              {pronounOptions.map((pronounOption) => (
                <CommandItem
                  className={cn(
                    "cursor-pointer",
                    pronouns === pronounOption.value
                      ? "bg-bcgw-yellow-dark"
                      : "hover:bg-bcgw-yellow-light",
                  )}
                  key={pronounOption.value}
                  value={pronounOption.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === pronouns ? "" : currentValue);
                    setIsPronounDropdownOpen(false);
                  }}
                >
                  {pronounOption.label}
                </CommandItem>
              ))}
              {/* custom pronouns already chosen */}
              {pronouns !== "" &&
                !pronounOptions.some(
                  (o) => o.value.toLowerCase() === pronouns.toLowerCase(),
                ) && (
                  <CommandItem
                    className={"cursor-pointer bg-bcgw-yellow-dark"}
                    key={pronouns}
                    value={pronouns}
                    onSelect={() => {
                      onChange("");
                      setIsPronounDropdownOpen(false);
                    }}
                  >
                    {pronouns}
                  </CommandItem>
                )}
              {/* user entered a custom pronoun option */}
              {pronounQuery.trim() !== "" &&
                !pronounOptions.some(
                  (o) => o.value.toLowerCase() === pronounQuery.toLowerCase(),
                ) && (
                  <CommandItem
                    className={cn(
                      "cursor-pointer",
                      "hover:bg-bcgw-yellow-light",
                    )}
                    key={pronounQuery}
                    value={pronounQuery}
                    onSelect={() => {
                      onChange(pronounQuery);
                      setIsPronounDropdownOpen(false);
                      setPronounQuery("");
                    }}
                  >
                    + {pronounQuery}
                  </CommandItem>
                )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
