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

function App() {
  return (
    <div className="App">
      <Router>
        <LayoutWithNavbarAndSidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Protect /faculty route */}
          <Route
            path="/faculty"
            element={<ProtectedRoute element={StaffLayout} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

// Custom layout component to conditionally show Navbar and Sidebar
const LayoutWithNavbarAndSidebar = () => {
  const location = useLocation(); // Get the current route

  // Conditionally render Navbar and Sidebar only if NOT on the homepage
  return location.pathname !== "/" ? (
    <>
      <Navbar />
      <Sidebar />
    </>
  ) : null;
};

export default App;
