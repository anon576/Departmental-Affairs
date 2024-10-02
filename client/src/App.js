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
import ViewConference from "./Component/Staff/Research/Publications/Conferance/ViewConferance";
import ConferencesList from "./Component/Staff/Research/Publications/Conferance/ConferencesList";
import AddConference from "./Component/Staff/Research/Publications/Conferance/AddConference";
import UpdateConference from "./Component/Staff/Research/Publications/Conferance/UpdateConferance";

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
              path="/add/conference"
              element={<ProtectedRoute element={AddConference} />}
            />

            <Route
              path="/conference/list"
              element={<ProtectedRoute element={ConferencesList} />}
            />

            <Route
              path="/conferences/view/:id"
              element={<ProtectedRoute element={ViewConference} />}
            />

            <Route
              path="/conferences/update/:id"
              element={<ProtectedRoute element={UpdateConference} />}
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
