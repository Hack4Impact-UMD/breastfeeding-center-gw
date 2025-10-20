interface modalPropsType {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height: number;
  width?: number;
}

const Modal = ({
  open,
  onClose,
  children,
  height,
  width = 450,
}: modalPropsType): React.ReactElement => {
  const heightString = height + "px";
  return (
    <div
      className="z-20"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {open ? (
        <>
          <div
            className="fixed w-screen h-screen z-0 bg-[rgba(0,0,0,0.4)] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4"
            onClick={() => onClose()}
          />
          <div className="fixed -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
            <div
              className="bg-white z-10 rounded-lg shadow-xs"
              style={{
                minHeight: heightString,
                width: `${width}px`,
              }}
            >
              {children}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Modal;
