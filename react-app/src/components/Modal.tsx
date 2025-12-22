import React from "react";

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

  return (
    <>
      {open && (
        <>
          <div
            className="fixed w-screen h-screen z-50 bg-[rgba(0,0,0,0.4)] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4"
            onClick={() => {
              if (!disabled && closable) onClose();
            }}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex justify-center items-center px-3 sm:px-0 w-full">
            <div
              className="bg-white rounded-lg shadow-xl overflow-hidden min-w-[300px]"
              style={{ width: `${width}px`, minHeight: heightString }}
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
