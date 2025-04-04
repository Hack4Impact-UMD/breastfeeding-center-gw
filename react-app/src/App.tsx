import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ConfirmLogoutPage from "./pages/ConfirmLogoutPage";
import LogoutPage from "./pages/LogoutPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
                path="/"
                element={
                }
              />*/}
        <Route path="/login" element={<LoginPage />} />
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
        <Route path="/*" element={<ConfirmLogoutPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      <Route path="/confirm-logout" element={<ConfirmLogoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
