import { useState, useRef } from "react";
import Modal from "../../components/Modal";
import { FiCheckCircle } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import apptUploadIcon from "../../assets/apptUpload.svg";
import clientUploadIcon from "../../assets/clientUpload.svg";
import { axiosClient } from "@/lib/utils";

type FileUploadPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FileUploadPopup = ({ isOpen, onClose }: FileUploadPopupProps) => {
  const resetState = () => {
    setApptFile(null);
    setClientFile(null);
    setApptFileName("");
    setClientFileName("");
    setErrorType("none");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const [apptFile, setApptFile] = useState<File | null>(null);
  const [clientFile, setClientFile] = useState<File | null>(null);

  const [apptFileName, setApptFileName] = useState<string>();
  const [clientFileName, setClientFileName] = useState<string>();

  const apptFileInputRef = useRef<HTMLInputElement>(null);
  const clientFileInputRef = useRef<HTMLInputElement>(null);

  const [errorType, setErrorType] = useState<
    "none" | "invalidType" | "missingClients"
  >("none");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "appt" | "client",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const invalidType = false; // TODO: implement check for correct files
    if (invalidType) {
      setErrorType("invalidType");
      return;
    }
    const fileName = file?.name;

    setErrorType("none");
    if (type === "appt") {
      setApptFile(file);
      setApptFileName(fileName);
    }
    if (type === "client") {
      setClientFile(file);
      setClientFileName(fileName);
    }
  };

  const handleApptFile = () => {
    setApptFile(null);
    setApptFileName("");
    if (apptFileInputRef.current) {
      apptFileInputRef.current.value = "";
    }
  };

  const handleClientFile = () => {
    setClientFile(null);
    setClientFileName("");
    if (clientFileInputRef.current) {
      clientFileInputRef.current.value = "";
    }
  };
  const handleSubmit = () => {
    handleUploadSubmit(apptFile, clientFile);
    handleClose();
  };

  const handleUploadSubmit = async (
    apptFile: File | null,
    clientFile: File | null,
  ) => {
    // TODO: Handle file upload logic
    const formData = new FormData();
    if (apptFile) {
      formData.append("appointments", apptFile);
    }
    if (clientFile) {
      formData.append("clients", clientFile);
    }
    try {
      const axiosInstance = axiosClient();
      const response = (await axiosInstance).post("/jane/upload", formData);
      console.log("File uploaded successfully:", (await response).data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    const missingClients = false; // TODO: implement check for missing clients
    if (missingClients) {
      setErrorType("missingClients");
      return;
    }
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
            className="absolute top-0.25 right-0.25 text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
          >
            <IoIosClose size={40} />
          </button>
        </div>
        <div className="w-full h-[1.5px] bg-black" />

        <p className="text-gray-500 m-3">
          <span className="text-red-600">*</span> Appointment sheet is required
        </p>

        <div className="flex flex-row justify-evenly place-items-center mt-6 mb-2">
          <div className="flex flex-col items-center">
            <label
              htmlFor="appt-upload"
              className="cursor-pointer flex flex-col items-center"
            >
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
              ref={apptFileInputRef}
              accept=".xlsx,.csv"
              className="hidden"
              onChange={(e) => handleFileChange(e, "appt")}
            />
            <div className={apptFileName ? "block" : "invisible"}>
              <div className="flex text-sm font-bold items-center mt-1">
                <p className="truncate text-[#1264B1] max-w-[7rem]">
                  {apptFileName}
                </p>
                <button
                  onClick={() => {
                    handleApptFile();
                  }}
                  className="text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
                >
                  <IoIosClose size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mb-2">
            <label
              htmlFor="client-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <img
                src={clientUploadIcon}
                alt="Upload Clients"
                className="w-16 h-16"
              />
              <span className="mt-2 text-sm font-medium">
                <span className="underline underline-offset-2 decoration-1">
                  UPLOAD CLIENTS
                </span>
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
              ref={clientFileInputRef}
              accept=".xlsx,.csv"
              className="hidden"
              onChange={(e) => handleFileChange(e, "client")}
            />
            <div className={clientFileName ? "block" : "invisible"}>
              <div className="flex text-sm font-bold items-center mt-1">
                <p className="truncate text-[#1264B1] max-w-[7rem]">
                  {clientFileName}
                </p>
                <button
                  onClick={() => {
                    handleClientFile();
                  }}
                  className="text-bcgw-blue-dark hover:text-gray-600 cursor-pointer"
                >
                  <IoIosClose size={20} />
                </button>
              </div>
            </div>
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
                className="underline cursor-pointer"
              >
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
