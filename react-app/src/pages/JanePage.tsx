import { SetStateAction, useState } from "react";
import Header from "../components/header.tsx";
import NavigationBar from "../components/NavigationBar.tsx";
import home from "../assets/management.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React from "react";

const JanePage = () => {
  const [file, setFile] = useState<File | null>(null);

  //file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Selected file:", selectedFile.name);
    }
  };

  const buttonStyle =
    "bg-bcgw-yellow-dark text-lg border-1 border-black-500 py-2 px-8 rounded-full cursor-pointer";
  const transparentYellowButtonStyle =
    "bg-transparent text-bcgw-yellow-dark border-2 border-bcgw-yellow-dark py-1 px-2 rounded-full cursor-pointer";
  const transparentGrayButtonStyle =
    "bg-transparent text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";

  return (
    <>
      <Header></Header>
      {/* <NavigationBar></NavigationBar> */}

      <div className="flex flex-col h-screen w-screen p-8 pr-20 pl-14 bg-gray-200">
        {/*headings*/}
        <div className={centerItemsInDiv}>
          <div>
            <h1 className="font-bold">JANE Statistics</h1>
            <h2>Dashboard</h2>
          </div>
          <div>
            {/*} <button className="bg-blue-500 text-white p-2 rounded">
              Select Date Range
            </button>*/}
          </div>
        </div>
        {/*upload section*/}
        <div className={`${centerItemsInDiv} basis-20xs`}>
          <div className={centerItemsInDiv}>
            <button
              className={`${buttonStyle} mr-5`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              UPLOAD NEW SPREADSHEET
            </button>
            <input
              id="file-input"
              type="file"
              accept=".xlsx, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <img
              data-tooltip-id="my-tooltip-1"
              className="w-[30px] h-[30px]"
              src={home}
            />
            <ReactTooltip
              id="my-tooltip-1"
              place="bottom"
              content="totle tip"
            />
          </div>
        {/*view spreadsheet name section*/}
          <div className="text-left basis-200">
            <h3>Most Recent Upload</h3>
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-white p-1 pt-0 pb-0 mt-2">
                  <div>{file ? `${file.name}` : "No file uploaded yet"}</div>
                  <img
                    className="w-[30px] h-[30px] pl-3 cursor-pointer"
                    src={home}
                    onClick={() => setFile(null)} 
                  />
                </div>
                <button className={`${transparentYellowButtonStyle} ml-6 mt-2`}>
                  Jane Doe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*graphs*/}
        <div>
          <div className={`${centerItemsInDiv} pt-4`}>
            <button>Graph/Table</button>
            <button className={transparentGrayButtonStyle}>Export</button>
          </div>
          <div className="mt-3">
            <img className="w-full bg-white" src={home} />
          </div>
        </div>
      </div>
    </>
  );
};

export default JanePage;
