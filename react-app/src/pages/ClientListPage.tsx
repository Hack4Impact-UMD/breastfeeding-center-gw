import { useState } from "react";
import Header from "../components/header.tsx";
import NavigationBar from "../components/NavigationBar/NavigationBar.tsx";
import { LuListFilter } from "react-icons/lu";
import { LuSearch } from "react-icons/lu";
import DeleteRowPopup from "@/components/DeleteRowPopup.tsx";
import { Client, clientListColumns } from "@/components/DataTable/Columns.tsx";
import { ClientListTable } from "@/components/DataTable/ClientListTable.tsx";

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
        <div className="flex flex-col p-8 pr-20 pl-14 min-h-screen">
          {/*headings*/}
          <div className={centerItemsInDiv}>
            <div>
              <h1 className="font-bold">Client List</h1>
            </div>
          </div>

          {/*table section*/}
          <div className="mt-6">
            <ClientListTable
              columns={clientListColumns}
              data={sampleClientData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientList;
