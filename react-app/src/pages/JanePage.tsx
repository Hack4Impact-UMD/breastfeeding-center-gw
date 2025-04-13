import { useState } from "react";
import Header from "../components/header.tsx";
//import NavigationBar from "../components/NavigationBar.tsx";
import home from "../assets/management.svg";
import React from "react";
import { PieArcSeries, PieChart } from "reaviz";
import { Jane } from "../types/JaneType.ts";

const JanePage = () => {
  //styles
  const buttonStyle =
    "bg-bcgw-yellow-dark text-lg border-1 border-black-500 py-2 px-8 rounded-full cursor-pointer";
  const transparentYellowButtonStyle =
    "bg-transparent text-bcgw-yellow-dark border-2 border-bcgw-yellow-dark py-1 px-2 rounded-full cursor-pointer";
  const transparentGrayButtonStyle =
    "bg-transparent text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";
  const centerItemsInDiv = "flex justify-between items-center";
  const chartDiv =
    "flex flex-col items-center justify-center bg-white border-2 border-black p-5 mt-2 rounded-lg";

  //file upload
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Selected file:", selectedFile.name);
    }
  };

  //DUMMY DATA FOR CHART
  const data: Jane[] = [
    {
      apptId: "1",
      firstName: "bub",
      lastName: "bubb",
      email: "b@gma.com",
      visitType: "TELEHEALTH",
      treatment: "JAHSGJA",
      insurance: "ashgah",
      date: "2025-01-01",
      babyDob: "2023-05-20",
    },
    {
      apptId: "2",
      firstName: "huhh",
      lastName: "hbuuh",
      email: "bdsjh@hotmail.com",
      visitType: "HOMEVISIT",
      treatment: "Checkup",
      insurance: "khgkh",
      date: "2025-01-02",
      babyDob: "2023-04-15",
    },
    {
      apptId: "3",
      firstName: "Charles",
      lastName: "Charles",
      email: "charles@myspace.com",
      visitType: "TELEHEALTH",
      treatment: "duddd",
      insurance: "skdjh",
      date: "2025-01-03",
      babyDob: "2023-02-10",
    },
    {
      apptId: "4",
      firstName: "jhsgj",
      lastName: "sjhgjs",
      email: "diana@tel.com",
      visitType: "OFFICE",
      treatment: "milk",
      insurance: "life",
      date: "2025-01-04",
      babyDob: "2023-01-25",
    },
    {
      apptId: "5",
      firstName: "looooop",
      lastName: "gmail",
      email: "lp@example.com",
      visitType: "OFFICE",
      treatment: "milk",
      insurance: "life",
      date: "2025-01-05",
      babyDob: "2023-03-25",
    },
  ];

  //dummy dates
  const START_DATE = new Date("2025-01-01");
  const END_DATE = new Date("2025-01-05");

  //convert dates to strings for display
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    });

  //find number of appointments of each type
  const visitTypeCounts: Record<string, number> = {};

  const filteredData = data.filter((jane) => {
    const appointmentDate = new Date(jane.date);
    return appointmentDate >= START_DATE && appointmentDate <= END_DATE;
  });

  filteredData.forEach((jane) => {
    const type = jane.visitType || "Unknown";
    visitTypeCounts[type] = (visitTypeCounts[type] || 0) + 1;
  });

  const chartData = Object.entries(visitTypeCounts).map(([key, value]) => ({
    key,
    data: value,
  }));

  //chart colors
  const chartColors = ["#ffae53", "#4fd2c6", "#66e201"];

  return (
    <>
      <Header></Header>
      {/* <NavigationBar></NavigationBar> */}

      <div className="flex flex-col min-h-screen w-full p-8 pr-20 pl-14 bg-gray-200">
        {/*headings*/}
        <div className={centerItemsInDiv}>
          <div>
            <h1 className="font-bold">JANE Statistics</h1>
            <h2>Dashboard</h2>
          </div>
          {/*date picker*/}
          <div>
            <span>DATE PICKER</span>
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
          </div>
          {/*view most recent upload section*/}
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
          <div className={chartDiv}>
            {/*chart title*/}
            <span className="self-start font-semibold text-xl mb-2">
              Visit Breakdown: {formatDate(START_DATE)} - {formatDate(END_DATE)}
            </span>
            {/*chart*/}
            <PieChart
              data={chartData}
              margins={[-50, 0, 0, 0]}
              series={
                <PieArcSeries doughnut={true} colorScheme={chartColors}/>  
              }
            />
            {/*legend*/}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {chartData.map((item, index) => (
                <div key={item.key} className="flex items-center gap-2">
                  <div
                    className="w-10 h-4"
                    style={{
                      backgroundColor: chartColors[index % chartColors.length],
                    }}
                  />
                  <span>{item.key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JanePage;
