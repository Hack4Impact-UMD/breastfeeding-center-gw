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
    <Modal open={isOpen} onClose={onClose} height={400}>
      <div className="p-6 w-[400px]">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Jane File Upload</h2>
          <button onClick={onClose}>&times;</button>
        </div>

        <p className="text-sm text-red-600 mb-2">
          * Upload appointments is required
        </p>
        <div className="flex justify-around items-center mb-4">
          <div className="flex flex-col items-center">
            <label
              htmlFor="appt-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <img src={apptUploadIcon} alt="Upload Appts" className="w-12 h-12" />
              <span className="text-sm text-red-600 mt-2">UPLOAD APPTS</span>
              {apptFile && <FiCheckCircle className="text-green-600 mt-1" />}
            </label>
            <input
              id="appt-upload"
              type="file"
              accept=".xlsx,.csv"
              className="hidden"
              onChange={(e) => handleFileChange(e, "appt")}
            />
          </div>

          <div className="flex flex-col items-center">
            <label
              htmlFor="client-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <img src={clientUploadIcon} alt="Upload Clients" className="w-12 h-12" />
              <span className="text-sm mt-2">UPLOAD CLIENTS</span>
              {clientFile && <FiCheckCircle className="text-green-600 mt-1" />}
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
          <p className="text-sm text-red-600">
            Some clients in the uploaded appointment sheet are not in the system. Please upload client sheet with new clients.{" "}
            <span
              data-tooltip-id="missingClientsTip"
              className="underline cursor-pointer"
            >
              View missing clients
            </span>
          </p>
        )}

        <div className="flex justify-center mt-6">
          <button
            className={`px-6 py-2 rounded ${
              uploadButtonEnabled
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
    </Modal>
  );
};

export default FileUploadPopup;
