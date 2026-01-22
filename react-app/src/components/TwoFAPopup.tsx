import Modal from "./Modal";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

const TwoFAPopup = ({
  open: openModal,
  onCodeSubmit,
  disabled,
}: {
  open: boolean;
  onCodeSubmit: (code: string) => void;
  disabled: boolean;
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) setActiveIndex(index + 1);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        if (index > 0) setActiveIndex(index - 1);
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleClick = (index: number) => setActiveIndex(index);

  const allFilled = otp.every((digit) => digit !== "");

  const twoFA = (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center px-6 sm:px-12">
        <p className="mt-2 mb-6 text-xl sm:text-3xl font-semibold text-center font-Montserrat">
          Two-Factor Authentication
        </p>

        {/* OTP Inputs */}
        <div className="flex gap-2 sm:gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => handleClick(index)}
              className={`w-10 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl border-2 rounded-lg ${activeIndex === index ? "border-[#1239BB]" : "border-black-300"
                } focus:outline-none`}
            />
          ))}
        </div>

        <p className="text-center text-sm sm:text-lg leading-6 mb-6 mx-6">
          The verification code has been sent to your phone. Enter the code to
          continue.
        </p>

        <Button
          onClick={() => {
            setOtp(Array(6).fill(""));
            onCodeSubmit(otp.join(""));
          }}
          disabled={!allFilled || disabled}
          variant={"yellow"}
          className={`font-bold rounded-full py-3 px-12 sm:py-4 sm:px-20 text-sm sm:text-lg mb-4 ${allFilled
            ? "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light cursor-pointer"
            : "bg-bcgw-gray-light cursor-not-allowed"
            }`}
        >
          Submit
        </Button>
      </div>
    </div>
  );

  return (
    <Modal open={openModal} disabled={disabled} onClose={() => { }}>
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full">{twoFA}</div>
    </Modal>
  );
};

export default TwoFAPopup;
