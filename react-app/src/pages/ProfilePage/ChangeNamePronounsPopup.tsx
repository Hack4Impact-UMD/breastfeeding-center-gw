import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "../../components/Modal";
import { Button } from "@/components/ui/button";
import PronounsComboBox from "@/components/PronounsComboBox";

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
              <PronounsComboBox pronouns={pronouns} onChange={setPronouns} />
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
