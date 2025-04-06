import Modal from "./Modal";
import { BiArrowBack } from "react-icons/bi";
import { useState, useRef, useEffect } from "react";

const TwoFAPopup = (): React.JSX.Element => {
  const [openModal, setOpenModal] = useState(true);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const CORRECT_CODE = "123456";
  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
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
    index: number
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

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleSubmit = () => {
    const code = otp.join("");
    if (code !== CORRECT_CODE) {
      setError(true);
    } else {
      setError(false);
      console.log("Success");
    }
  };

  const handleResendCode = () => {
    console.log("Resent code!");
    setOtp(new Array(6).fill(""));
    setActiveIndex(0);
    setError(false);
  };

  const allFilled = otp.every((digit) => digit !== "");

  const twoFA = (
    <div>
      <button onClick={handleClose} className="cursor-pointer p-4">
        <BiArrowBack className="w-10 h-8" />
      </button>
      <div className="flex flex-col items-center justify-center px-15">
        <p className="my-6 text-[2.5rem] font-semibold text-center font-Monsterrat">
          Two-Factor Authentication
        </p>
        <div className="flex gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => handleClick(index)}
              className={`w-14 h-14 text-center text-2xl border-2 rounded-lg ${
                activeIndex === index ? "border-[#1239BB]" : "border-black-300"
              } focus:outline-none`}
            />
          ))}
        </div>
        {error && (
          <p className="text-red-600 text-center mt-2 text-[1rem] font-medium">
            Two-factor authentication code is incorrect
          </p>
        )}

        <p className="leading-6 font-Inter text-[1.2rem] text-center mb-6 mt-6">
          A message with a verification code has been <br /> sent to your phone.
          Enter the code to continue.
        </p>
        <button
          onClick={handleSubmit}
          disabled={!allFilled}
          className={`w-1/2 h-14 cursor-pointer rounded-full ${
            allFilled ? "bg-yellow-400 hover:opacity-90" : "bg-gray-300"
          } self-center text-[1.5rem] font-semibold font-inter transition`}
        >
          Submit
        </button>

        <p className="leading-6 font-Inter text-[1.2rem] text-[#1239BB] text-center p-8">
          Didn't get a verification code? <br />
          <button
            onClick={handleResendCode}
            className="underline text-[#1239BB] hover:opacity-80 transition cursor-pointer"
          >
            Resend a new code
          </button>
        </p>
      </div>
    </div>
  );

  return (
    <Modal open={openModal} onClose={handleClose} height={600} width={700}>
      {twoFA}
    </Modal>
  );
};

export default TwoFAPopup;
