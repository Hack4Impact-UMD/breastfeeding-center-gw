import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import LogoutPage from "./pages/LogoutPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import UserManagementPage from "./pages/UserManagementPage/UserManagementPage";
import RequireAuth from "./auth/RequireAuth";
import PaysimpleDashboard from "./pages/PaysimpleDashboardPage";
import { AuthProvider } from "./auth/AuthProvider";
import AcuityDashboard from "./pages/AcuityDashboardPage/AcuityDashboardPage";
import JaneDashboard from "./pages/JaneDashboardPage/JaneDashboardPage";
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
import RequireNoAuth from "./auth/RequireNoAuth";
import { axiosClient } from "./lib/utils";
import LayoutShell from "./pages/LayoutShell";
import { ToastContainer } from "react-toastify";
import { showErrorToast } from "./components/Toasts/ErrorToast";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import MfaEnrollPage from "./pages/MfaEnrollPage";

function App() {
  return (
    <TooltipProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        icon={false}
      />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/login"
                element={
                  <RequireNoAuth>
                    <LoginPage />
                  </RequireNoAuth>
                }
              />
              <Route path="/logout" element={<LogoutPage />} />
              <Route
                path="/register-success"
                element={<RegisterSuccessPage />}
              />
              <Route
                path="/register/:inviteId"
                element={
                  <RequireNoAuth>
                    <NewUserPage />
                  </RequireNoAuth>
                }
              />

              <Route
                element={
                  <RequireAuth>
                    <LayoutShell />
                  </RequireAuth>
                }
              >
                <Route path="/" element={<p>Home</p>} />
                <Route path="/services/jane" element={<JaneDashboard />} />
                <Route path="/services/jane/data" element={<JaneDataPage />} />
                <Route path="/services/acuity" element={<AcuityDashboard />} />
                <Route
                  path="/services/paysimple"
                  element={<PaysimpleDashboard />}
                />
                <Route path="/clients" element={<ClientListPage />} />
                <Route
                  path="/clients/journey/:id"
                  element={<ClientJourneyPage />}
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/user-management"
                  element={<UserManagementPage />}
                />
              </Route>

              <Route
                path="/testfunctions"
                element={
                  <RequireAuth>
                    <div className="flex flex-col gap-2 p-2">
                      <div className="space-x-3">
                        <strong>Yellow: </strong>
                        <Button
                          variant={"yellow"}
                        >
                          TEST
                        </Button>
                        <Button variant={"yellow"} size="lg" disabled>
                          TEST
                        </Button>
                        <Button
                          onClick={() => showErrorToast("Hello world")}
                          variant={"yellow"}
                          className="rounded-full"
                        >
                          toast
                        </Button>
                      </div>
                      <div className="space-x-3">
                        <strong>Outline: </strong>
                        <Button variant={"outline"}>TEST</Button>
                        <Button variant={"outline"} className="rounded-full">
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
                        <Button variant={"gray"}>TEST</Button>
                        <Button variant={"gray"} className="rounded-full">
                          TEST
                        </Button>
                        <Button
                          variant={"gray"}
                          className="rounded-full"
                          onClick={async () => {
                            const axiosInstance = await axiosClient();
                            await axiosInstance
                              .get("/jane/appointments?clientId=14806")
                              .then((response) => console.log(response))
                              .catch((error) => console.log(error));
                          }}
                        >
                          TEST HERE!!
                        </Button>
                      </div>
                    </div>
                  </RequireAuth>
                }
              />
              <Route path="/verify" element={<VerifyEmailPage />} />
              <Route path="/mfa-enroll" element={<MfaEnrollPage />} />
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <NotFoundPage />
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
