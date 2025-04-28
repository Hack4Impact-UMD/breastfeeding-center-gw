import { useState } from "react";
import Header from "../components/header.tsx";
import NavigationBar from "../components/NavigationBar/NavigationBar.tsx";

const ClientJourney = () => {
  //nav bar
  const [navBarOpen, setNavBarOpen] = useState(true);

  //styles
  const centerItemsInDiv = "flex justify-between items-center";
  const dividingLine = "w-full h-1 border-t border-black-500 mt-3 mb-3";
  const tableSection = "py-3 pb-9 space-y-3";

  //client basic info
  const name = "Jane Doe";
  const children = "James Doe";
  const partners = "John Doe";

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
              <h1 className="font-bold">Client Journey</h1>
              <h2 className="font-[Montserrat]">Dashboard</h2>
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
              <div className="border-2 border-black">I AM A TABsLE</div>
            </div>

            <div className={tableSection}>
              <h2 className="font-bold">JANE Consults</h2>
              <div className="border-2 border-black">I AM A TABsLE</div>
            </div>

            <div className={tableSection}>
              <h2 className="font-bold">Paysimple Rentals</h2>
              <div className="border-2 border-black">I AM A TABsLE</div>
            </div>

            <div className={tableSection}>
              <h2 className="font-bold">One-Time Purchases</h2>
              <div className="border-2 border-black">I AM A TABsLE</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientJourney;
