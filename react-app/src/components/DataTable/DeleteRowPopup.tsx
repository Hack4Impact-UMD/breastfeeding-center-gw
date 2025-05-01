import Modal from "../Modal";
import { IoIosClose } from "react-icons/io";

const DeleteRowPopup = ({
  openModal,
  onClose,
  onConfirm,
}: {
  openModal: boolean;
  onClose: () => void;
  onConfirm: () => void;
}): React.JSX.Element => {
  const yellowSquareButtonStyle =
    "bg-bcgw-yellow-dark text-lg border border-black-500 px-8 py-5 h-8 w-30 rounded-lg cursor-pointer flex items-center justify-center";
  const clearSquareButtonStyle =
    "text-lg border border-black-500 px-8 py-5 h-8 w-30 rounded-lg cursor-pointer flex items-center justify-center";

  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  const deleteRow = (
    <div>
      <button
        onClick={() => {
          onClose();
        }}
        className="absolute top-4 right-4 text-bcgw-blue-dark hover:text-gray-600 z-10 cursor-pointer">
        <IoIosClose size={50} />
      </button>
      <div className="relative p-8 flex flex-col items-center justify-center text-center h-full">
        <h2 className="mt-8 mb-4 font-semibold text-center font-Montserrat">
          Are you sure?
        </h2>

        <p className={`leading-6 font-Inter text-lg text-center mb-6 mx-6`}>
          Are you sure you want to delete the following row(s)?
        </p>
        <div className="flex justify-center gap-8">
          <button onClick={onClose} className={clearSquareButtonStyle}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={yellowSquareButtonStyle}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal open={openModal} onClose={onClose} height={300} width={450}>
      {deleteRow}
    </Modal>
  );
};

export default DeleteRowPopup;
