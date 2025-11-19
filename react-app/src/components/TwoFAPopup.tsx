import Modal from "./Modal";
import { BiArrowBack } from "react-icons/bi";
import { useState, useRef, useEffect } from "react";

const TwoFAPopup = ({
  openModal,
  onClose,
}: {
  openModal: boolean;
  onClose: any;
}): React.JSX.Element => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const CORRECT_CODE = "123456";

  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const handleClose = () => {
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) setActiveIndex(index + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
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

  const handleSubmit = () => {
    const code = otp.join("");
    if (code !== CORRECT_CODE) setError(true);
    else {
      setError(false);
      console.log("Success");
    }
  };

  const handleResendCode = () => {
    setOtp(new Array(6).fill(""));
    setActiveIndex(0);
    setError(false);
  };

  const allFilled = otp.every((digit) => digit !== "");

  const twoFA = (
    <div className="w-full">
      <button onClick={handleClose} className="cursor-pointer p-4">
        <BiArrowBack className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>

      <div className="flex flex-col items-center justify-center px-6 sm:px-12">

        <p className="mt-2 mb-6 text-xl sm:text-3xl font-semibold text-center font-Montserrat">
          Two-Factor Authentication
        </p>

        {/* OTP Inputs */}
        <div className="flex gap-2 sm:gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => handleClick(index)}
              className={`w-10 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl border-2 rounded-lg ${
                activeIndex === index ? "border-[#1239BB]" : "border-black-300"
              } focus:outline-none`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center text-xs sm:text-sm mb-2">
            Two-factor authentication code is incorrect
          </p>
        )}

        <p className="text-center text-sm sm:text-lg leading-6 mb-6 mx-6">
          The verification code has been sent to your phone. Enter the code to continue.
        </p>

        <button
          onClick={handleSubmit}
          disabled={!allFilled}
          className={`font-bold rounded-full py-3 px-12 sm:py-4 sm:px-20 text-sm sm:text-lg mb-4 ${
            allFilled
              ? "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light cursor-pointer"
              : "bg-bcgw-gray-light cursor-not-allowed"
          }`}
        >
          Submit
        </button>

        <p className="flex flex-col gap-1 text-center text-[#1239BB] text-sm sm:text-lg p-4">
          Didn’t get a verification code?
          <button
            onClick={handleResendCode}
            className="underline hover:opacity-80 transition cursor-pointer"
          >
            Resend a new code
          </button>
        </p>
      </div>
    </div>
  );

  return (
    <Modal open={openModal} onClose={handleClose} height={520} width={550}>
  <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
    {twoFA}
  </div>
</Modal>
  );
};

export default TwoFAPopup;
