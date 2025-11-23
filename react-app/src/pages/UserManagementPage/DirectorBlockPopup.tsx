import Modal from "../../components/Modal";
import { IoIosClose } from "react-icons/io";

const DirectorBlockPopup = ({
  openModal,
  onClose,
}: {
  openModal: boolean;
  onClose: () => void;
}): React.JSX.Element => {
  return (
    <Modal open={openModal} onClose={() => onClose()} height={220} width={450}>
      <div className="h-full flex flex-col relative">
        {/* Close icon top-right */}
        <button
          onClick={() => onClose()}
          className="w-full flex justify-end p-2 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
        >
          <IoIosClose size={32} />
        </button>

        {/* Title */}
        <h2 className="px-8 pb-4 text-2xl font-semibold text-center">
          Account Cannot Be Modified
        </h2>

        <div className="px-8 pb-8 text-center text-lg text-gray-700 leading-relaxed max-h-full">
          This director account cannot be removed or set to a lower permission.
          <br /> There must be one director.
        </div>
      </div>
    </Modal>
  );
};

export default DirectorBlockPopup;
