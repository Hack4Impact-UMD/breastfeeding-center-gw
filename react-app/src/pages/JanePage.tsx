import { SetStateAction, useState } from "react";
import Header from "../components/header.tsx";
import NavigationBar from "../components/NavigationBar.tsx";
import home from "../assets/management.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React from "react";
import {
  DatePicker,
  DateRange,
  DateRangePicker,
} from "../components/DatePicker.tsx";
import { DonutChart } from "../components/DonutChart.tsx";
import {
  AvailableChartColors,
  constructCategoryColors,
} from "../lib/chartUtils.ts";
import { Legend } from "../components/Legend.tsx";

const JanePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );
  const data = [
    {
      name: "Home Visit",
      amount: 0.666,
    },
    {
      name: "In Office",
      amount: 0.166,
    },
    {
      name: "Telehealth",
      amount: 0.166,
    },
  ];

  //file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      // need to abbreviate long file name
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

      <div className="flex flex-col min-h-screen min-w-screen p-8 pr-20 pl-14 bg-gray-200">
        {/*headings*/}
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h1 className="font-bold">JANE Statistics</h1>
            <h2 className="font-[Montserrat] font-medium -mt-2">Dashboard</h2>
          </div>
          <div className="pt-5 -mt-1">
            <DateRangePicker
              enableYearNavigation
              value={dateRange}
              onChange={setDateRange}
              className="w-60"
            />
          </div>

          {/* <div className="flex flex-col items-center gap-y-4">
      

          </div> */}
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
            <ReactTooltip
              id="my-tooltip-1"
              place="bottom"
              content="totle tip"
            />
          </div>
          {/*view spreadsheet name section*/}
          <div className="text-left basis-200 font-[Montserrat] font-medium">
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
          <div className="mt-3 bg-white h-full w-full flex justify-around border-1 rounded-[16px]">
            <div className="flex flex-col w-[80%] gap-5 pl-7">
              <h2 className="font-semibold font-Inter p-3">
                Visits Breakdown
                {dateRange
                  ? `, ${dateRange.from?.toLocaleDateString()} - ${
                      dateRange.to?.toLocaleDateString() ?? ""
                    }`
                  : ""}
              </h2>
              <div className="flex justify-center">
                <DonutChart
                  className="mb-5"
                  data={data}
                  variant="pie"
                  category="name"
                  value="amount"
                  valueFormatter={(number: number) =>
                    `${(number * 100).toFixed(1)}%`
                  }
                />
              </div>
            </div>
            <div className="flex justify-center w-[20%] p-3">
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Legend data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JanePage;
