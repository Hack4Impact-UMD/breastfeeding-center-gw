import Modal from "../Modal";
import { IoIosClose } from "react-icons/io";
import { Button } from "../ui/button";

const DeleteRowPopup = ({
  openModal,
  onClose,
  onConfirm,
}: {
  openModal: boolean;
  onClose: () => void;
  onConfirm: () => void;
}): React.JSX.Element => {
  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  const deleteRow = (
    <div className="h-full flex flex-col relative">
      <div className="w-full flex justify-end p-2">
        <IoIosClose
          className="text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
          onClick={() => onClose()}
          aria-label="Close"
          size={32}
        />
      </div>
      <h2 className="px-8 pb-6 text-2xl font-semibold text-center">
        Are you sure?
      </h2>

      <div className="px-8 pb-6 text-center text-lg text-gray-700 leading-relaxed max-h-full">
        Are you sure you want to delete the selected row(s)?
      </div>
      <div className="px-8 pb-8 flex justify-center gap-3">
        <Button variant="outline" onClick={() => onClose()}>
          CANCEL
        </Button>
        <Button
          variant="yellow"
          onClick={() => {
            handleSubmit();
          }}
        >
          CONFIRM
        </Button>
      </div>
    </div>
  );

  return (
    <Modal open={openModal} onClose={onClose} height={260} width={450}>
      {deleteRow}
    </Modal>
  );
};

export default DeleteRowPopup;
