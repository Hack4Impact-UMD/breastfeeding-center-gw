import Modal from "../../components/Modal";
import { IoIosClose } from "react-icons/io";
import { User } from "@/types/UserType";
import { Button } from "../../components/ui/button";
import { useDeleteUser } from "@/hooks/mutations/useDeleteUser";
const RemoveAccessPopup = ({
  openModal,
  onClose,
  user,
}: {
  openModal: boolean;
  onClose: () => void;
  user: User;
}): React.JSX.Element => {
  const { mutate: deleteUser } = useDeleteUser();

  return (
    <Modal open={openModal} onClose={() => onClose()} height={220} width={400}>
      <div className="h-full flex flex-col relative">
        {/* Close icon top-right */}
        <div className="w-full flex justify-end p-2">
          <IoIosClose
            className="text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
            onClick={() => onClose()}
            aria-label="Close"
            size={32}
          />
        </div>

        {/* Title */}
        <h2 className="px-8 pb-6 text-2xl font-semibold text-center">
          Remove Access?
        </h2>

        <div className="px-8 pb-6 text-center text-lg text-gray-700 leading-relaxed max-h-full">
          Are you sure you would like to remove this user's account?
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex justify-center gap-3">
          <Button variant="outline" onClick={() => onClose()}>
            CANCEL
          </Button>
          <Button
            variant="yellow"
            onClick={() => {
              deleteUser(user.auth_id);
              onClose();
            }}
          >
            CONFIRM
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveAccessPopup;
