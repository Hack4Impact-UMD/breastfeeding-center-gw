import { toast } from "react-toastify";
import { IoIosClose } from "react-icons/io";
import alertIcon from '@/assets/alert.png';

type AlertToastProps = {
  message: string;
  closeToast?: () => void;
};

export function AlertToast({ message, closeToast }: AlertToastProps) {
  return (
    <div className="bg-slate-800 text-white rounded-xl shadow-lg p-4 flex items-center gap-3 max-w-[400px] w-full">
      <img 
        src={alertIcon}
        alt="alert" 
        className="w-5 h-5 flex-shrink-0"
      />
      <div className="flex-1 text-[15px] break-words">{message}</div>
      <IoIosClose
        onClick={closeToast}
        className="cursor-pointer text-white hover:opacity-100 opacity-70 flex-shrink-0"
        size={28}
      />
    </div>
  );
}

export function showAlertToast(message: string, autoClose: number = 5000) {
  toast.warning(<AlertToast message={message} />, {
    position: "bottom-right",
    closeButton: false,
    hideProgressBar: true,
    icon: false,
    autoClose: autoClose,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}