interface modalPropsType {
  open: boolean;
  onClose: any;
  children: React.ReactNode;
  height: number;
}

const Modal = ({
  open,
  onClose,
  children,
  height,
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
              className="w-[450px] bg-white z-10 shadow-xs border-[1.5px] border-black"
              style={{ height: heightString }}
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

Modal.defaultProps = {
  width: 400,
};

export default Modal;
