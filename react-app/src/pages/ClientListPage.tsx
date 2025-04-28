import { useState } from "react";
import Header from "../components/header.tsx";
import NavigationBar from "../components/NavigationBar/NavigationBar.tsx";
import { LuListFilter } from "react-icons/lu";
import { LuSearch } from "react-icons/lu";
import DeleteRowPopup from "@/components/DeleteRowPopup.tsx";

const ClientList = () => {
  //nav bar
  const [navBarOpen, setNavBarOpen] = useState(true);

  //search bar
  const [searchQuery, setSearchQuery] = useState("");

  //delete row popup
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //styles
  const filterButtonStyle =
    "bg-bcgw-yellow-dark text-lg border border-black-500 px-6 h-8 rounded-lg cursor-pointer flex items-center justify-center";
  const centerItemsInDiv = "flex justify-between items-center";

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
              <h2 className="font-[Montserrat]">Dashboard</h2>
            </div>
          </div>
          {/*sorting section*/}
          <div className="flex items-center space-x-1">
            {/*filter button*/}
            <div>
              <button
                className={`${filterButtonStyle} mr-5 text-nowrap`}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <div className="flex items-center justify-center space-x-6">
                  <LuListFilter className="w-5 h-5" />
                  <span className="text-base">Filter</span>{" "}
                </div>
              </button>
            </div>
            {/*search bar*/}
            <div className="basis-200">
              <div className="my-4">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 px-3 py-2 border border-black-500 bg-[#D4D4D4]"
                  />
                  <LuSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/*table section*/}
          <div>I AM A TABLE</div>
          <button
            onClick={openModal}
            className={filterButtonStyle}
          >
            DELETE POPUP
          </button>
          <DeleteRowPopup openModal={isModalOpen} onClose={closeModal} />
        </div>
      </div>
    </>
  );
};

export default ClientList;
