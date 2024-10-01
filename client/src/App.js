import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./Component/Home/Home";
import StaffLayout from "./Component/Home/StaffLayout";
import Navbar from "./Component/Web Utils/Bar/Navbar";
import Sidebar from "./Component/Web Utils/Bar/Sidebar";
import "./App.css";
import ProtectedRoute from "./Component/Home/ProtectedRoute";
import { AppProvider } from "./Component/Context/AppContext"; // Import the generalized AppContext
import AddConferance from "./Component/Staff/Research/Publications/Conferance/AddConferance";

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Router>
          <LayoutWithNavbarAndSidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/faculty"
              element={<ProtectedRoute element={StaffLayout} />}
            />

            <Route
              path="/addconferance"
              element={<ProtectedRoute element={AddConferance} />}
            />
          </Routes>
        </Router>
      </div>
    </AppProvider>
  );
}

const LayoutWithNavbarAndSidebar = () => {
  const location = useLocation();

  return location.pathname !== "/" ? (
    <>
      <Navbar />
      <Sidebar />
    </>
  ) : null;
};

export default App;
