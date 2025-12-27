import Modal from "@/components/Modal";
import { MultiFactorInfo } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { AsteriskIcon, PhoneIcon } from "lucide-react";

interface Select2FAMethodModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (hint: MultiFactorInfo) => void;
  hints: MultiFactorInfo[];
}

const Select2FAMethodModal = ({
  open,
  onClose,
  onSelect,
  hints,
}: Select2FAMethodModalProps) => {
  return (
    <Modal open={open} onClose={onClose} width={500}>
      <div className="flex flex-col bg-white rounded-2xl w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Choose a second factor</h2>
        <div className="flex flex-col space-y-2">
          {hints.map((hint: MultiFactorInfo & { phoneNumber?: string }) => (
            <Button
              key={hint.uid}
              onClick={() => onSelect(hint)}
              className="text-left p-8 border rounded-md hover:bg-gray-100 flex justify-start items-center"
              disabled={hint.factorId !== "phone"}
            >
              {hint.factorId === "phone" ? <PhoneIcon /> : <AsteriskIcon />}
              <div>
                <p className="font-medium">
                  {hint.displayName || "Phone Number"}
                </p>
                <p className="text-sm text-gray-600">
                  {hint.phoneNumber ?? "n/a"}
                </p>
              </div>
            </Button>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Select2FAMethodModal;
