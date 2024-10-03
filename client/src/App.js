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
import Register from "./Component/Login/Register";
import AddJournal from "./Component/Staff/Research/Publications/Journal/AddJournal";
import JournalsList from "./Component/Staff/Research/Publications/Journal/JournalList";
import ViewJournal from "./Component/Staff/Research/Publications/Journal/ViewJournal";
import UpdateJournal from "./Component/Staff/Research/Publications/Journal/UpdateJournal";

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Router>

          <LayoutWithNavbarAndSidebar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
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
              path="/conferences/view/"
              element={<ProtectedRoute element={ViewConference} />}
            />

            <Route
              path="/conferences/update/"
              element={<ProtectedRoute element={UpdateConference} />}
            />


            <Route
              path="/add/journal"
              element={<ProtectedRoute element={AddJournal} />}
            />

            <Route
              path="/journal/list"
              element={<ProtectedRoute element={JournalsList} />}
            />

            <Route
              path="/journal/view/"
              element={<ProtectedRoute element={ViewJournal} />}
            />

            <Route
              path="/journal/update/"
              element={<ProtectedRoute element={UpdateJournal} />}
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
