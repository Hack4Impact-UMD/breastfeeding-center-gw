interface modalPropsType {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number; // Make optional
  width?: number;
  responsive?: boolean; // Add this flag
}

const Modal = ({
  open,
  onClose,
  children,
  height,
  width = 450,
  responsive = false,
}: modalPropsType): React.ReactElement => {
  const heightString = height ? height + "px" : "auto";
  
  return (
  <>
    {open && (
      <>
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-40"
          onClick={onClose}
        />
        <div
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex justify-center items-center px-3 sm:px-0`}
        >
          <div
            className="bg-white rounded-lg shadow-xs overflow-y-auto w-full sm:w-auto"
            style={
              responsive
                ? {
                    maxWidth: `${width}px`,
                    maxHeight: "90vh",
                    width: "100%",
                  }
                : {
                    minHeight: heightString,
                    width: `${width}px`,
                  }
            }
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