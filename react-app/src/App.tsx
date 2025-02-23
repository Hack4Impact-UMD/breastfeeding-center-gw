import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./muiTheme.ts";

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <AuthProvider> */}
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
        </Routes>
      </BrowserRouter>
      {/* </AuthProvider> */}
    </ThemeProvider>
  );
}

export default App;
