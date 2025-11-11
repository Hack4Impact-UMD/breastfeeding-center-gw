import { useState, useRef } from "react";
import Modal from "../../components/Modal";
import { FiCheckCircle } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import apptUploadIcon from "../../assets/apptUpload.svg";
import clientUploadIcon from "../../assets/clientUpload.svg";
import { useUploadJaneData } from "@/hooks/mutations/useUploadJaneData";
import Loading from "@/components/Loading";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/config/query";
import queries from "@/queries";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [missingClients, setMissingClients] = useState<string[]>([]);

  const uploadMutation = useUploadJaneData({
    onError: (err) => {
      console.error(err);

      if (err instanceof AxiosError) {
        if (Array.isArray(err.response?.data.details)) {
          //missing clients
          setErrorType("missingClients");
          setMissingClients(err.response.data.details as string[]);
        } else {
          setErrorType("other");
        }
      } else {
        setErrorType("other");
      }
    },
    onSuccess: () => {
      console.log("Upload successful!");
      handleClose();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queries.janeData.uploadedDataTable._def,
      });
    },
  });

  const [errorType, setErrorType] = useState<
    "none" | "invalidType" | "missingClients" | "other"
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
  const handleSubmit = async () => {
    //TODO: Better loading state
    handleUploadSubmit(apptFile, clientFile);
  };

  const handleUploadSubmit = async (
    apptFile: File | null,
    clientFile: File | null,
  ) => {
    uploadMutation.mutate({
      apptFile,
      clientFile,
    });
  };

  const uploadButtonEnabled =
    !!apptFile && errorType === "none" && !uploadMutation.isPending;

  return (
    <Modal open={isOpen} onClose={handleClose} height={350} width={500} disabled={uploadMutation.isPending}>
      <div className="flex flex-col h-full py-2">
        <div className="flex justify-between items-center m-2">
          <p className="text-lg">Jane File Upload</p>
          <button
            onClick={() => {
              if (!uploadMutation.isPending) {
                handleClose();
              }
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
                <Tooltip>
                  <TooltipTrigger>
                    <p className="truncate text-[#1264B1] max-w-[7rem]">
                      {apptFileName}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="bg-neutral-200 text-neutral-950 [&_svg]:bg-neutral-200 [&_svg]:fill-neutral-200" side="bottom">
                    <span className="text-sm">{apptFileName}</span>
                  </TooltipContent>
                </Tooltip>
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
                <Tooltip>
                  <TooltipTrigger>
                    <p className="truncate text-[#1264B1] max-w-[7rem]">
                      {clientFileName}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="bg-neutral-200 text-neutral-950 [&_svg]:bg-neutral-200 [&_svg]:fill-neutral-200" side="bottom">
                    <span className="text-sm">{clientFileName}</span>
                  </TooltipContent>
                </Tooltip>
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
        {errorType === "other" && (
          <p className="text-sm text-center mx-4 text-red-600">
            Something went wrong: {uploadMutation.error?.message}
          </p>
        )}
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
                {missingClients.map((client, index) => (
                  <p key={index}>{client}</p>
                ))}
              </div>
            </Tooltip>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 justify-center mt-6">
          {uploadMutation.isPending ? (
            <Loading />
          ) : (
            <Button
              variant={"yellow"}
              className={`px-6 py-2 rounded-lg border border-black cursor-pointer`}
              disabled={!uploadButtonEnabled}
              onClick={handleSubmit}
            >
              UPLOAD DATA
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FileUploadPopup;
