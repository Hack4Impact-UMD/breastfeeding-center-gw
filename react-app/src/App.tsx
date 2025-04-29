import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import LogoutPage from "./pages/LogoutPage";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthProvider";
import { getBabyInfo, getClientAppointments } from "./backend/AcuityCalls";
import AcuityDashboard from "./pages/AcuityDashboard";

function App() {
  // const navigate = useNavigate();
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <AcuityDashboard />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <NotFoundPage />
              </RequireAuth>
            }
          />
          <Route path="/services/acuity" element={<AcuityDashboard />} />
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
                  }}
                >
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
