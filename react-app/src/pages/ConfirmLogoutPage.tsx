import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.tsx";

export default function ConfirmLogoutPage() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
  
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-bcgw-yellow-dark text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
  
        <Modal open={isOpen} onClose={() => setIsOpen(false)} height={300}>
          <div className="relative p-8 flex flex-col items-center justify-center text-center w-[450px] h-[330px]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600"
            >
              <IoCloseCircleOutline size={50} />
            </button>
            <h2 className="text-xl font-semibold flex-grow flex items-center justify-center">Are you sure you want to log out?</h2>
            <div className="flex justify-center gap-6 w-full pb-8">
              <button onClick={() => setIsOpen(false)} className="w-1/3 rounded-lg px-5 py-3 border border-black">
                Cancel
              </button>
              <button
                onClick={() => navigate("/logout")}
                className="w-1/3 bg-bcgw-yellow-dark rounded-lg px-5 py-3 border border-black"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
}