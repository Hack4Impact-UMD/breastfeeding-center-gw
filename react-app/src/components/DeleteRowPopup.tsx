import Modal from "./Modal";
import { BiArrowBack } from "react-icons/bi";

const DeleteRowPopup = ({
  openModal,
  onClose,
}: {
  openModal: boolean;
  onClose: any;
}): React.JSX.Element => {
  const yellowSquareButtonStyle =
    "bg-bcgw-yellow-dark text-lg border border-black-500 px-8 py-5 h-8 w-30 rounded-lg cursor-pointer flex items-center justify-center";
  const clearSquareButtonStyle =
    "text-lg border border-black-500 px-8 py-5 h-8 w-30 rounded-lg cursor-pointer flex items-center justify-center";

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {};

  const deleteRow = (
    <div>
      <button onClick={handleClose} className="cursor-pointer p-4">
        <BiArrowBack className="w-10 h-8" />
      </button>
      <div className="flex flex-col items-center justify-center px-15">
        <p className="mt-3 mb-8 text-3xl font-semibold text-center font-Montserrat">
          Are you sure?
        </p>

        <p className={`leading-6 font-Inter text-lg text-center mb-6 mx-6`}>
          Are you sure you want to delete the following row(s)?
        </p>
        <div className="flex justify-center gap-8">
          <button onClick={handleClose} className={clearSquareButtonStyle}>
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
    <Modal open={openModal} onClose={handleClose} height={350} width={550}>
      {deleteRow}
    </Modal>
  );
};

export default DeleteRowPopup;
