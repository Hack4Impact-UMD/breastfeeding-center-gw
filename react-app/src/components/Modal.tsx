import React from "react";

const Modal = ({
  open,
  onClose,
  children,
  height,
  width = 450,
  disabled = false,
}: modalPropsType): React.ReactElement => {
  if (!open) return <></>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.4)]"
        onClick={() => {
          if (!disabled) onClose();
        }}
      />
      
      <div
        className="relative z-10 w-full"
        style={{
          maxWidth: width ? `${width}px` : "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;