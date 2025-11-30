import { toast, ToastOptions } from 'react-toastify';
import successIcon from '@/assets/success.png';
import alertIcon from '@/assets/alert.png';
import errorIcon from '@/assets/error.png';

const defaultToastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const createToastContent = (icon: string, message: string) => (
  <div className="flex items-center">
    <img 
      src={icon}
      alt="toast-icon" 
      className="w-5 h-5 mr-3"
    />
    <span>{message}</span>
  </div>
);

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(
    createToastContent(successIcon, message),
    { ...defaultToastOptions, ...options }
  );
};

export const showAlertToast = (message: string, options?: ToastOptions) => {
  toast.warning(
    createToastContent(alertIcon, message),
    { ...defaultToastOptions, ...options }
  );
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(
    createToastContent(errorIcon, message),
    { ...defaultToastOptions, ...options }
  );
};