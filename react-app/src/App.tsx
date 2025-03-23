import { BrowserRouter, Routes, Route } from "react-router-dom";
import Test from "./pages/test";
import Test2 from "./pages/test2";
import Test3 from "./pages/test3";
import TestService from "./pages/testService1";
import TestService2 from "./pages/testService2";

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
        <Route
          path="/testfunctions"
          element={
            <button
              className={"bg-bcgw-yellow-dark rounded-lg px-2 py-1 m-2"}
              onClick={async () => {}}
            >
              TEST
            </button>
          }
        />
        <Route path="/" element={<Test />} />
        <Route path="/test2" element={<Test2 />} />
        <Route path="/test3" element={<Test3 />} />
        <Route path="/testService" element={<TestService />} />
        <Route path="/testService2" element={<TestService2 />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
