import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import LogoutPage from "./pages/LogoutPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Header from "./components/Header";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthProvider";
import { getBabyInfo, getClientAppointments } from "./backend/AcuityCalls";
import AcuityDashboard from "./pages/AcuityDashboardPage";
import JaneDashboard from "./pages/JaneDashboardPage";
import JaneDataPage from "./pages/JaneDataPage";
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
          <Route
            path="/services/jane"
            element={
              <RequireAuth>
                <JaneDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/services/jane/data"
            element={
              <RequireAuth>
                <JaneDataPage />
              </RequireAuth>
            }
          />
          <Route
            path="/services/acuity"
            element={
              <RequireAuth>
                <AcuityDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/clients"
            element={
              <RequireAuth>
                <ClientListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/clients/journey"
            element={
              <RequireAuth>
                <ClientJourneyPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
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
              <RequireAuth>
                <button
                  className={"bg-bcgw-yellow-dark rounded-lg px-2 py-1 m-2"}
                  onClick={async () => {
                    getBabyInfo()
                      .then(() => console.log("Success"))
                      .catch();

                    getClientAppointments()
                      .then(() => console.log("Success"))
                      .catch();
                  }}>
                  TEST
                </button>
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
