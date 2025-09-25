// src/pages/JaneDataPage/FileUploadPopup.tsx
import { useState } from "react";
import Modal from "../../components/Modal";
import { FiCheckCircle } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import apptUploadIcon from "../../assets/apptUpload.svg";
import clientUploadIcon from "../../assets/clientUpload.svg";

type FileUploadPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FileUploadPopup = ({ isOpen, onClose }: FileUploadPopupProps) => {
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
  const [errorType, setErrorType] = useState<
    "none" | "invalidType" | "missingClients"
  >("none");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "appt" | "client"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const invalidType = false; // TODO: implement check for correct files
    if (invalidType) {
      setErrorType("invalidType");
      return;
    }

    setErrorType("none");
    if (type === "appt") setApptFile(file);
    if (type === "client") setClientFile(file);
  };

  const handleSubmit = () => {
    const missingClients = false; // TODO: implement check for missing clients
    if (missingClients) {
      setErrorType("missingClients");
      return;
    }
    handleUploadSubmit(apptFile, clientFile);
    handleClose();
  };

  const handleUploadSubmit = (
    apptFile: File | null,
    clientFile: File | null
  ) => {
    // TODO: Handle file upload logic
    console.log("Appointment file:", apptFile);
    console.log("Client file:", clientFile);
  };

  const uploadButtonEnabled = !!apptFile && errorType === "none";

  return (
    <Modal open={isOpen} onClose={handleClose} height={350} width={500}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center m-2">
          <p className="text-lg">Jane File Upload</p>
          <button
            onClick={() => {
              handleClose();
            }}
            className="absolute top-0.25 right-0.25 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer">
            <IoIosClose size={40} />
          </button>
        </div>
        <div className="w-full h-[1.5px] bg-black" />

        <p className="text-gray-500 m-3">
          <span className="text-red-600">*</span> Appointment sheet is required
        </p>

        <div className="flex flex-row justify-evenly place-items-center mt-4 mb-4">
          <div className="flex flex-col items-center">
            <label
              htmlFor="appt-upload"
              className="cursor-pointer flex flex-col items-center">
              <img
                src={apptUploadIcon}
                alt="Upload Appts"
                className="w-14 h-14 ml-3"
              />
              <span className="mt-2 text-sm font-medium">
                <span className="text-red-600">* </span>
                <span className="underline underline-offset-2 decoration-1">
                  UPLOAD APPTS
                </span>
                {apptFile && (
                  <FiCheckCircle
                    className="inline-block align-middle ml-1"
                    size={18}
                    color="#04BB22"
                  />
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
            <label
              htmlFor="client-upload"
              className="cursor-pointer flex flex-col items-center">
              <img
                src={clientUploadIcon}
                alt="Upload Clients"
                className="w-16 h-16"
              />
              <span className="mt-2 text-sm font-medium underline underline-offset-2 decoration-1">
                UPLOAD CLIENTS
                {clientFile && (
                  <FiCheckCircle
                    className="inline-block align-middle ml-1"
                    size={18}
                    color="#04BB22"
                  />
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
          <p className="text-sm text-center mx-4 text-red-600">
            The file(s) you uploaded does not match upload type
          </p>
        )}
        {errorType === "missingClients" && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-center mx-4 text-red-600">
              Some clients in the uploaded appointment sheet are not in the
              system. Please upload client sheet with new clients.{" "}
              <span
                data-tooltip-id="missingClientsTip"
                className="underline cursor-pointer">
                View missing clients
              </span>
            </p>

            <Tooltip id="missingClientsTip" place="bottom">
              <div className="text-sm text-center">
                <div>Bob Bobby</div>
                <div>Bob Bobby</div>
                <div>Bob Bobby</div>
                <div>Bob Bobby</div>
                <div>Bob Bobby</div>
                <div>...</div>
              </div>
            </Tooltip>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            className={`px-6 py-2 rounded-lg border border-black ${
              uploadButtonEnabled
                ? "bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!uploadButtonEnabled}
            onClick={handleSubmit}>
            UPLOAD DATA
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FileUploadPopup;
