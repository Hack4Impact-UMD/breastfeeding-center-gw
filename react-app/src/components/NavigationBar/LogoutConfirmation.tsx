import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal.tsx";
import { logOut } from "@/services/authService.ts";
import { Button } from "../ui/button.tsx";

export default function LogoutConfirmation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  function handleLogOut() {
    navigate("/logout", { state: { fromApp: true } });
    logOut();
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      height={250}
    >
      <button
        onClick={() => {
          onClose();
        }}
        className="w-full flex justify-end p-2 text-bcgw-blue-dark hover:text-gray-600 z-10 cursor-pointer"
      >
        <IoIosClose size={32} />
      </button>
      <div className="relative flex flex-col items-center justify-center text-center h-full">
        <h2 className="font-semibold flex-grow flex items-center justify-center px-8 pb-6">
          Are you sure you want to log out?
        </h2>
        <div className="flex justify-center gap-6">
          <Button
            variant={"outline"}
            className="py-4 px-6 text-md"
            onClick={() => {
              onClose();
            }}
          >
            CANCEL
          </Button>
          <Button
            variant={"yellow"}
            className="py-4 px-6 text-md"
            onClick={() => handleLogOut()}
          >
            CONFIRM
          </Button>
        </div>
      </div>
    </Modal>
  );
}
