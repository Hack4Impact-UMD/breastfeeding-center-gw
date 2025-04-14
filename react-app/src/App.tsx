import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
                path="/"
                element={
                }
              />*/}
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/testfunctions"
          element={
            <button
              className={"bg-bcgw-yellow-dark rounded-lg px-2 py-1 m-2"}
              onClick={async () => { }}>
              TEST
            </button>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
