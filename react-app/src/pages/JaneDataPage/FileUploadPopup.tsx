// src/pages/JaneDataPage/FileUploadPopup.tsx
import { useState } from "react";
import Modal from "../../components/Modal";
import { FiCheckCircle } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import apptUploadIcon from "../../assets/apptUpload.svg";
import clientUploadIcon from "../../assets/clientUpload.svg";

type FileUploadPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apptFile: File | null, clientFile: File | null) => void;
};

const FileUploadPopup = ({ isOpen, onClose, onSubmit }: FileUploadPopupProps) => {

  const resetState = () => {
    setApptFile(null);
    setClientFile(null);
    setErrorType("none");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const [apptFile, setApptFile] = useState<File | null>(null);
  const [clientFile, setClientFile] = useState<File | null>(null);
  const [errorType, setErrorType] = useState<"none" | "invalidType" | "missingClients">("none");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "appt" | "client") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const valid = file.name.endsWith(".xlsx") || file.name.endsWith(".csv");
    if (!valid) {
      setErrorType("invalidType");
      return;
    }

    setErrorType("none");
    if (type === "appt") setApptFile(file);
    if (type === "client") setClientFile(file);
  };

  const handleSubmit = () => {
    if (apptFile && !clientFile) {
      setErrorType("missingClients");
      return;
    }
    onSubmit(apptFile, clientFile);
    onClose();
  };

  const uploadButtonEnabled = !!apptFile && errorType === "none";

  return (
    <Modal open={isOpen} onClose={handleClose} height={350} width={500}>
      <div className="w-[500px] h-[350px] p-5 rounded-xl border-[1.5px]">

        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-normal text-[36px] leading-[20px] tracking-[0.01em] text-black">Jane File Upload</h2>
          <button onClick={handleClose}>&times;</button>
        </div>

        <hr className="-mx-5 mt-1 mb-3 border-t border-black/75" />

        <p className="text-[16px] text-gray-500 mb-4">
          <span className="text-red-600">*</span> Appointment sheet is required
        </p>

        <div className="grid grid-cols-2 gap-4 place-items-center mt-8 mb-4">

          <div className="flex flex-col items-center">
            <label htmlFor="appt-upload" className="cursor-pointer flex flex-col items-center">
              <img src={apptUploadIcon} alt="Upload Appts" className="w-14 h-14" />
              <span className="mt-2 text-[13px] font-medium underline underline-offset-2 decoration-1 text-gray-900">
                <span className="text-red-600">*</span> UPLOAD APPTS
                {apptFile && (
                  <FiCheckCircle className="inline-block align-middle ml-1" size={18} color="#04BB22" />
                )}
              </span>
            </label>
            <input
              id="appt-upload"
              type="file"
              accept=".xlsx,.csv"
              className="hidden"
              onChange={(e) => handleFileChange(e, "appt")}
            />
          </div>

          <div className="flex flex-col items-center mb-2">
            <label htmlFor="client-upload" className="cursor-pointer flex flex-col items-center">
              <img src={clientUploadIcon} alt="Upload Clients" className="w-14 h-14" />
              <span className="mt-2 text-[13px] font-medium underline underline-offset-2 decoration-1 text-gray-900">
                UPLOAD CLIENTS
                {clientFile && (
                  <FiCheckCircle className="inline-block align-middle ml-1" size={18} color="#04BB22" />
                )}
              </span>
            </label>
            <input
              id="client-upload"
              type="file"
              accept=".xlsx,.csv"
              className="hidden"
              onChange={(e) => handleFileChange(e, "client")}
            />
          </div>
        </div>


        {/* Errors */}
        {errorType === "invalidType" && (
          <p className="text-sm text-red-600">
            The file(s) you uploaded does not match upload type
          </p>
        )}
        {errorType === "missingClients" && (
          <>
            <p className="text-sm text-red-600">
              Some clients in the uploaded appointment sheet are not in the system. Please upload client sheet with new clients.{" "}
              <span
                data-tooltip-id="missingClientsTip"
                className="underline cursor-pointer"
              >
                View missing clients
              </span>
            </p>

            <Tooltip id="missingClientsTip" place="bottom">
              <div className="text-sm">
                <div>Bob Bobby</div>
                <div>Bob Bobby</div>
                <div>Bob Bobby</div>
                <div>Bob Bobby</div>
                <div>Bob Bobby</div>
                <div>...</div>
              </div>
            </Tooltip>
          </>
        )}

        <div className="flex justify-center mt-6">
          <button
            className={`px-6 py-2 rounded ${uploadButtonEnabled
              ? "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light"
              : "bg-gray-300 cursor-not-allowed"
              }`}
            disabled={!uploadButtonEnabled}
            onClick={handleSubmit}
          >
            UPLOAD DATA
          </button>
        </div>
      </div>
    </Modal >
  );
};

export default FileUploadPopup;

