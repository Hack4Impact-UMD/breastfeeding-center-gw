import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "../../components/Modal";
import { Button } from "@/components/ui/button";

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

  const pronounOptions = [
    "She/Her/Hers",
    "He/Him/His",
    "They/Them/Theirs",
    "Other",
    "None",
  ];

  const handleSave = () => {
    console.log("Updated name to:", { firstName, lastName, pronouns });
    // Add your save logic here
    onClose();
  };

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center my-2 mx-4">
        <p className="text-lg">Change Name and Pronouns</p>
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
    <Modal open={open} onClose={onClose} height={280} width={600}>
      <div className="flex flex-col h-full">
        <div>
          <ModalHeader onClose={onClose} />
          <div className="grid grid-cols-[130px_1fr] gap-y-4 m-8 mb-2 text-left items-center">
            <label className="text-sm font-medium">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border-[1.5px] border-black px-3 py-2"
              placeholder="FirstName"
            />

            <label className="text-sm font-medium">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border-[1.5px] border-black px-3 py-2"
              placeholder="LastName"
            />

            <label className="text-sm font-medium">Pronouns</label>
            <select
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              className="border-[1.5px] border-black px-3 py-2 bg-white cursor-pointer rounded-2xl w-fit"
            >
              {pronounOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end m-8 mt-0">
          <Button
            variant={"yellow"}
            className="py-4 px-6 text-md"
            disabled={isSaveDisabled}
            onClick={handleSave}
          >
            SAVE
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeNamePronounsPopup;