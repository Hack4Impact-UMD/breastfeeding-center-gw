import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "../../components/Modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDownIcon } from "lucide-react";

const ChangeNamePronounsPopup = ({
  open,
  onClose,
  initialFirstName,
  initialLastName,
  initialPronouns,
}: {
  open: boolean;
  onClose: () => void;
  initialFirstName: string;
  initialLastName: string;
  initialPronouns: string;
}) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [pronouns, setPronouns] = useState(initialPronouns);
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

  const handleSave = () => {
    console.log("Updated name to:", { firstName, lastName, pronouns });
    onClose();
  };

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center my-2 mx-4">
        <p className="text-base sm:text-lg">Change Name and Pronouns</p>
        <IoIosClose
          className="text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
          onClick={onClose}
          size={32}
        />
      </div>
      <div className="w-full h-[1.5px] bg-black" />
    </>
  );

  const isSaveDisabled = !firstName.trim() || !lastName.trim();

  return (
    <Modal open={open} onClose={onClose} height={350} width={600}>
      <div className="w-full">
        <div className="flex flex-col bg-white rounded-2xl w-full h-auto overflow-y-auto sm:overflow-visible">
          <ModalHeader onClose={onClose} />

          {/* CONTENT WRAPPER – now mobile responsive */}
          <div className="flex flex-col m-4 sm:m-8 mb-2 text-left space-y-4">
            {/* FIRST NAME */}
            <div className="flex flex-col sm:grid sm:grid-cols-[150px_1fr] sm:gap-x-2">
              <label className="text-sm sm:text-base font-medium mb-1 sm:mb-0 sm:content-center">
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-[1.5px] border-black px-3 py-2 text-sm sm:text-base"
                placeholder="First Name"
              />
            </div>

            {/* LAST NAME */}
            <div className="flex flex-col sm:grid sm:grid-cols-[150px_1fr] sm:gap-x-2">
              <label className="text-sm sm:text-base font-medium mb-1 sm:mb-0 sm:content-center">
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-[1.5px] border-black px-3 py-2 text-sm sm:text-base"
                placeholder="Last Name"
              />
            </div>

            {/* PRONOUNS */}
            <div className="flex flex-col sm:grid sm:grid-cols-[150px_1fr] sm:gap-x-2">
              <label className="text-sm sm:text-base font-medium mb-1 sm:mb-0 sm:content-center">
                Pronouns
              </label>
              <Popover
                open={isPronounDropdownOpen}
                onOpenChange={setIsPronounDropdownOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPronounDropdownOpen}
                    className="w-full sm:w-[175px] justify-between hover:bg-background rounded-2xl mb-4 sm:mb-0"
                  >
                    {pronouns ? pronouns : "Select..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[175px] p-0 bg-white">
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
                              setPronouns(
                                currentValue === pronouns ? "" : currentValue,
                              );
                              setIsPronounDropdownOpen(false);
                            }}
                          >
                            {pronounOption.label}
                          </CommandItem>
                        ))}
                        {pronouns !== "" &&
                          !pronounOptions.some(
                            (o) =>
                              o.value.toLowerCase() === pronouns.toLowerCase(),
                          ) && (
                            <CommandItem
                              className={cn(
                                "cursor-pointer bg-bcgw-yellow-dark",
                              )}
                              key={pronouns}
                              value={pronouns}
                              onSelect={() => {
                                setPronouns("");
                                setIsPronounDropdownOpen(false);
                              }}
                            >
                              {pronouns}
                            </CommandItem>
                          )}
                        {pronounQuery.trim() !== "" &&
                          !pronounOptions.some(
                            (o) =>
                              o.value.toLowerCase() ===
                              pronounQuery.toLowerCase(),
                          ) && (
                            <CommandItem
                              className={cn(
                                "cursor-pointer",
                                "hover:bg-bcgw-yellow-light",
                              )}
                              key={pronounQuery}
                              value={pronounQuery}
                              onSelect={() => {
                                setPronouns(pronounQuery);
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
            </div>
          </div>

          <div className="flex justify-center sm:justify-end m-4 sm:m-8 mt-0">
            <Button
              variant="yellow"
              className="w-full sm:w-auto py-4 px-6 text-sm sm:text-base"
              disabled={isSaveDisabled}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeNamePronounsPopup;
