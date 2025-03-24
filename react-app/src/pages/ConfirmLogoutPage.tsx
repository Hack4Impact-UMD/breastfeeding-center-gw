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
        <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-600 z-10"
        >
            <IoCloseCircleOutline size={50} />
        </button>
        <div className="relative p-8 flex flex-col items-center justify-center text-center h-full">
            
            <h2 className="text-xl font-semibold flex-grow flex items-center justify-center mt-[20px] mb-[0px]">Are you sure you want to log out?</h2>
            <div className="flex justify-center gap-6 pt-4 pb-8">
              <button 
                onClick={() => setIsOpen(false)} 
                className="flex-1 rounded-lg px-5 py-3 border border-black"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/logout")}
                className="flex-1 bg-bcgw-yellow-dark rounded-lg px-5 py-3 border border-black"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
}
