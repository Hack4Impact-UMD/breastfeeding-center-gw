import { useState } from "react";
import Header from "../../components/Header.tsx";
import NavigationBar from "../../components/NavigationBar/NavigationBar.tsx";
import { Client, clientListColumns } from "./ClientListTableColumns.tsx";
import { DataTable } from "@/components/DataTable/DataTable.tsx";

const ClientList = () => {
  //nav bar
  const [navBarOpen, setNavBarOpen] = useState(true);

  //styles
  const centerItemsInDiv = "flex justify-between items-center";

  const sampleClientData: Client[] = [
    {
      firstName: "Jane",
      lastName: "Doe",
      email: "jdoe@gmail.com",
      acuityClasses: 2,
      janeConsults: 3,
      rentals: 2,
      purchases: 1,
    },
    {
      firstName: "Jess",
      lastName: "Do",
      email: "jdo098@gmail.com",
      acuityClasses: 2,
      janeConsults: 1,
      rentals: 2,
      purchases: 1,
    },
    {
      firstName: "Joanne",
      lastName: "De",
      email: "jde111@gmail.com",
      acuityClasses: 1,
      janeConsults: 3,
      rentals: 5,
      purchases: 1,
    },
    {
      firstName: "Jenny",
      lastName: "Doe",
      email: "jdoe5234@gmail.com",
      acuityClasses: 1,
      janeConsults: 3,
      rentals: 2,
      purchases: 4,
    },
    {
      firstName: "Jan",
      lastName: "Doe",
      email: "jdoe1234@gmail.com",
      acuityClasses: 2,
      janeConsults: 2,
      rentals: 1,
      purchases: 1,
    },
    {
      firstName: "Janette",
      lastName: "Day",
      email: "jday@gmail.com",
      acuityClasses: 2,
      janeConsults: 3,
      rentals: 3,
      purchases: 0,
    },
    {
      firstName: "Jamie",
      lastName: "Dane",
      email: "jdane@gmail.com",
      acuityClasses: 1,
      janeConsults: 1,
      rentals: 0,
      purchases: 0,
    },
    {
      firstName: "Janice",
      lastName: "Di",
      email: "jdi1@gmail.com",
      acuityClasses: 4,
      janeConsults: 5,
      rentals: 9,
      purchases: 2,
    },
    {
      firstName: "Jennifer",
      lastName: "Dio",
      email: "jdio@gmail.com",
      acuityClasses: 1,
      janeConsults: 4,
      rentals: 9,
      purchases: 2,
    },
    {
      firstName: "Julie",
      lastName: "Diaz",
      email: "jdiaz@gmail.com",
      acuityClasses: 3,
      janeConsults: 4,
      rentals: 1,
      purchases: 6,
    },
  ];

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]" //set margin of content to 250px when nav bar is open and 60px when closed
        }`}>
        <Header />
        <div className="flex flex-col p-8 pr-20 pl-20">
          {/*headings*/}
          <div className={centerItemsInDiv}>
            <div>
              <h1 className="font-bold">Client List</h1>
            </div>
          </div>

          {/*table section*/}
          <div className="mt-5">
            <DataTable
              columns={clientListColumns}
              data={sampleClientData}
              tableType="clientList"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientList;
