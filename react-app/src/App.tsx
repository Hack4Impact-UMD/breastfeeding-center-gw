import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import LogoutPage from "./pages/LogoutPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import UserManagementPage from "./pages/UserManagementPage/UserManagementPage";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Header from "./components/Header";
import RequireAuth from "./auth/RequireAuth";
import PaysimpleDashboard from "./pages/PaysimpleDashboardPage";
import { AuthProvider } from "./auth/AuthProvider";
import { getBabyInfo, getClientAppointments } from "./backend/AcuityCalls";
import AcuityDashboard from "./pages/AcuityDashboardPage/AcuityDashboardPage";
import JaneDashboard from "./pages/JaneDashboardPage/JaneDashboardPage";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/query";
import ClientListPage from "./pages/ClientListPage/ClientListPage";
import ClientJourneyPage from "./pages/ClientJourneyPage/ClientJourneyPage";
import "react-tooltip/dist/react-tooltip.css";
import JaneDataPage from "./pages/JaneDataPage/JaneDataPage";
import NewUserPage from "./pages/NewUserPage/NewUserPage";
import RegisterSuccessPage from "./pages/NewUserPage/RegisterSuccessPage";
import { TooltipProvider } from "./components/ui/tooltip";
import { Button } from "./components/ui/button";
// import "@tremor/react/dist/esm/tremor.css";

function App() {
  const [navBarOpen, setNavBarOpen] = useState(false);
  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
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
                        }`}
                      >
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
                path="/services/paysimple"
                element={
                  <RequireAuth>
                    <PaysimpleDashboard />
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
                path="/user-management"
                element={
                  <RequireAuth>
                    <UserManagementPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/register-success"
                element={<RegisterSuccessPage />}
              />
              <Route path="/new-user" element={<NewUserPage />} />
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
                    <div className="flex flex-col gap-2 p-2">
                      <div className="space-x-3">
                        <strong>Yellow: </strong>
                        <Button
                          variant={"yellow"}
                          onClick={async () => {
                            getBabyInfo()
                              .then(() => console.log("Success"))
                              .catch();

                            getClientAppointments()
                              .then(() => console.log("Success"))
                              .catch();
                          }}
                        >
                          TEST
                        </Button>
                        <Button
                          variant={"yellow"}
                          size="lg"
                          disabled
                        >
                          TEST
                        </Button>
                        <Button
                          variant={"yellow"}
                          className="rounded-full"
                        >
                          TEST
                        </Button>
                      </div>
                      <div className="space-x-3">
                        <strong>Outline: </strong>
                        <Button
                          variant={"outline"}
                        >
                          TEST
                        </Button>
                        <Button
                          variant={"outline"}
                          className="rounded-full"
                        >
                          TEST
                        </Button>
                        <Button
                          variant={"outline"}
                          disabled
                          className="rounded-full"
                        >
                          TEST
                        </Button>
                      </div>
                      <div className="space-x-3">
                        <strong>Gray: </strong>
                        <Button
                          variant={"gray"}
                        >
                          TEST
                        </Button>
                        <Button
                          variant={"gray"}
                          className="rounded-full"
                        >
                          TEST
                        </Button>
                        <Button
                          variant={"gray"}
                          disabled
                          className="rounded-full"
                        >
                          TEST
                        </Button>
                      </div>
                    </div>
                  </RequireAuth>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </TooltipProvider>
  );
}

export default App;
