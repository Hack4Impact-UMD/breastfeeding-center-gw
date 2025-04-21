import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import LogoutPage from "./pages/LogoutPage";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthProvider";
import JanePage from "./pages/JanePage";
import JaneData from "./pages/JaneData";

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
                <NavigationBar />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/services/jane" element={<JanePage />} />
          <Route path="/services/jane/data" element={<JaneData />} />
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
