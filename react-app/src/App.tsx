import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import LogoutPopup from "./components/NavigationBar/LogoutConfirmation";
import LogoutPage from "./pages/LogoutPage";
import NavigationBar from "./components/NavigationBar/NavigationBar";

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
        <Route path="/home" element={<NavigationBar />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
