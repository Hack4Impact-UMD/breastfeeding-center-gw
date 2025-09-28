import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../backend/AuthFunctions";
import Modal from "../Modal.tsx";

export default function LogoutConfirmation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  function handleLogOut() {
    logOut()
      .then(() => {
        navigate("/logout", { state: { fromApp: true } });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      height={250}>
      <button
        onClick={() => {
          onClose();
        }}
        className="absolute top-4 right-4 text-bcgw-blue-dark hover:text-gray-600 z-10 cursor-pointer">
        <IoIosClose size={50} />
      </button>
      <div className="relative p-8 flex flex-col items-center justify-center text-center h-full">
        <h2 className="font-semibold flex-grow flex items-center justify-center">
          Are you sure you want to log out?
        </h2>
        <div className="flex justify-center gap-6">
          <button
            onClick={() => {
              onClose();
            }}
            className="hover:bg-bcgw-yellow-light rounded-lg px-2 py-2 border border-black cursor-pointer">
            CANCEL
          </button>
          <button
            onClick={() => handleLogOut()}
            className="bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light rounded-lg px-2 py-2 border border-black cursor-pointer">
            CONFIRM
          </button>
        </div>
      </div>
    </Modal>
  );
}
