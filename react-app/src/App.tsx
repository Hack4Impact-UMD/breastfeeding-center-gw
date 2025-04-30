import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import LogoutPage from "./pages/LogoutPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Header from "./components/Header";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthProvider";
import JanePage from "./pages/JanePage";
import JaneData from "./pages/JaneData";
import { useState } from "react";
import ClientListPage from "./pages/ClientListPage";
import ClientJourneyPage from "./pages/ClientJourneyPage";

function App() {
  const [navBarOpen, setNavBarOpen] = useState(false);
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <>
                  <NavigationBar
                    navBarOpen={navBarOpen}
                    setNavBarOpen={setNavBarOpen}
                  />
                  <div
                    className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${
                      navBarOpen ? "ml-[250px]" : "ml-[60px]" //set margin of content to 250px when nav bar is open and 60px when closed
                    }`}>
                    <Header />
                  </div>
                </>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/services/jane" element={<JanePage />} />
          <Route path="/services/jane/data" element={<JaneData />} />
          <Route path="/clients" element={<ClientListPage />} />
          <Route path="/clients/journey" element={<ClientJourneyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <NotFoundPage />
              </RequireAuth>
            }
          />
          <Route
            path="/testfunctions"
            element={
              <button
                className={"bg-bcgw-yellow-dark rounded-lg px-2 py-1 m-2"}
                onClick={async () => {}}>
                TEST
              </button>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
