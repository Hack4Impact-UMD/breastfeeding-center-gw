import { twMerge } from "tailwind-merge"

const Loading = ({ className = "" }: { className?: string }): React.JSX.Element => {
  return (
    <div className={twMerge("w-full h-full flex flex-row justify-center items-center", className)}>
      <div
        className="w-5 h-5 border-2 border-[#0081AF]
                      border-t-transparent rounded-full 
                      animate-spin"
      ></div>
    </div>
  );
};

export default Loading;
