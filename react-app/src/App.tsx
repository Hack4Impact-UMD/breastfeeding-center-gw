import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './components/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
                path="/"
                element={
                }
              />
              <Route
                path="*"
                element={
                }
              /> */}
        <Route path="/login" element={<LoginPage />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
