import { useState } from "react";
import Header from "../../components/Header.tsx";
import NavigationBar from "../../components/NavigationBar/NavigationBar.tsx";
import {
  acuityColumns,
  AcuityData,
  JaneConsults,
  janeConsultsColumns,
  OneTimePurchase,
  oneTimePurchaseColumns,
  paysimpleColumns,
  PaySimpleRentals,
} from "./ClientJourneyTableColumns.tsx";
import { DataTable } from "../../components/DataTable/DataTable.tsx";

const ClientJourney = () => {
  //nav bar
  const [navBarOpen, setNavBarOpen] = useState(true);

  //styles
  const centerItemsInDiv = "flex justify-between items-center";
  const dividingLine = "w-full h-1 border-t border-black-500 mt-3 mb-3";
  const tableSection = "py-3 space-y-3";

  //client basic info
  const name = "Jane Doe";
  const children = "James Doe";
  const partners = "John Doe";

  const sampleAcuityData: AcuityData[] = [
    {
      class: "Class A",
      instructor: "A. Smith",
      date: "3/01/24",
    },
    {
      class: "Class B",
      instructor: "A. Smith",
      date: "3/01/23",
    },
  ];

  const sampleJaneConsults: JaneConsults[] = [
    {
      clinician: "B. Green",
      date: "2/01/24",
      service: "TELEHEALTH Postpartum",
      visitType: "TELEHEALTH",
      insurance: "Insurance Name",
    },
    {
      clinician: "B. Green",
      date: "1/12/24",
      service: "DC Office: Postpartum Lac",
      visitType: "HOMEVISIT",
      insurance: "Insurance Name",
    },
    {
      clinician: "C. Johnson",
      date: "3/23/23",
      service: "DC Office: Postpartum Lac",
      visitType: "HOMEVISIT",
      insurance: "Insurance Name",
    },
  ];

  const samplePaysimple: PaySimpleRentals[] = [
    {
      item: "Item A",
      totalCost: 20,
      rate: 10,
      startDate: "2/2/24",
      endDate: "2/9/24",
      rentalLength: 7,
    },
    {
      item: "Item B",
      totalCost: 30,
      rate: 10,
      startDate: "2/2/24",
      endDate: "2/9/24",
      rentalLength: 14,
    },
  ];

  const sampleOTPs: OneTimePurchase[] = [
    {
      item: "Item A",
      cost: 20,
      date: "1/12/24",
      platform: "Square",
    },
  ];

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]" //set margin of content to 250px when nav bar is open and 60px when closed
        }`}
      >
        <Header />
        <div className="flex flex-col p-8 pr-20 pl-20">
          {/*headings*/}
          <div className={centerItemsInDiv}>
            <div>
              <h1 className="font-bold">Client Journey</h1>
            </div>
          </div>

          {/*info section*/}
          <div className="flex flex-col space-y-1">
            <div className={dividingLine}></div> {/* dividing line */}
            {/* Information in between lines */}
            <div className="text-left space-y-2 px-3 py-2 w-full max-w-md">
              <div>
                <strong>NAME:</strong> {name}
              </div>
              <div>
                <strong>CHILDREN:</strong> {children}
              </div>
              <div>
                <strong>PARTNER(S):</strong> {partners}
              </div>
            </div>
            <div className={dividingLine}></div> {/* dividing line */}
          </div>

          {/*tables section*/}
          <div>
            <div className={tableSection}>
              <h2 className="font-bold">Acuity Classes</h2>
              <DataTable
                columns={acuityColumns}
                data={sampleAcuityData}
                tableType="default"
              />
            </div>

            <div className={tableSection}>
              <h2 className="font-bold">JANE Consults</h2>
              <DataTable
                columns={janeConsultsColumns}
                data={sampleJaneConsults}
                tableType="default"
              />
            </div>

            <div className={tableSection}>
              <h2 className="font-bold">Paysimple Rentals</h2>
              <DataTable
                columns={paysimpleColumns}
                data={samplePaysimple}
                tableType="default"
              />
            </div>

            <div className={tableSection}>
              <h2 className="font-bold">One-Time Purchases</h2>
              <DataTable
                columns={oneTimePurchaseColumns}
                data={sampleOTPs}
                tableType="default"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientJourney;
