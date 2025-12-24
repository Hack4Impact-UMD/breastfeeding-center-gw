import React, { useCallback } from "react";

interface ModalPropsType {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
  width?: number;
  disabled?: boolean;
  closable?: boolean;
}

const Modal = ({
  open,
  onClose,
  children,
  height,
  width = 450,
  disabled = false,
  closable = true
}: ModalPropsType): React.ReactElement => {
  const heightString = height ? height + "px" : "auto";

  const handleClose = useCallback(() => {
    if (!disabled && closable) onClose();
  }, [closable, disabled, onClose]);

  return (
    <>
      {open && (
        <>
          <div
            className="fixed w-screen h-screen z-50 bg-[rgba(0,0,0,0.4)] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4"
            onClick={handleClose}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex justify-center items-center px-3 sm:px-0 w-full"
            onClick={handleClose}
          >
            <div
              className="bg-white rounded-lg shadow-xl overflow-hidden min-w-[300px] w-full"
              style={{ maxWidth: `${width}px`, minHeight: heightString }}
              onClick={e => e.stopPropagation()}
            >
              {children}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
