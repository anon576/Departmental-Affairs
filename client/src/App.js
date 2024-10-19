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
import AddProposal from "./Component/Staff/Research/Praposal/AddPraposal";
import ProposalsList from './Component/Staff/Research/Praposal/Praposal_List'
import ViewProposal from "./Component/Staff/Research/Praposal/ViewPraposal";
import UpdateProposal from "./Component/Staff/Research/Praposal/UpdatePraposal";
import AddPatent from "./Component/Staff/Research/Patent/AddPatent";
import PatentsList from "./Component/Staff/Research/Patent/PatentList";
import ViewPatent from "./Component/Staff/Research/Patent/ViewPatent";
import UpdatePatent from "./Component/Staff/Research/Patent/UpdatePatent";
import AddCopyright from "./Component/Staff/Research/Copyright/AddCopyright";
import CopyrightList from "./Component/Staff/Research/Copyright/CopyrightList";
import ViewCopyright from "./Component/Staff/Research/Copyright/ViewCopyright";
import UpdateCopyright from "./Component/Staff/Research/Copyright/UpdateCopyright";
import FDPList from "./Component/Staff/FDP/FDPList";
import AddFDP from "./Component/Staff/FDP/AddFDP";
import ViewFDP from "./Component/Staff/FDP/ViewFDP";
import UpdateFDP from "./Component/Staff/FDP/UpdateFDP";
import AddSDP from "./Component/Staff/SDP/AddSDP";
import SDPList from "./Component/Staff/SDP/SDPList";
import ViewSDP from "./Component/Staff/SDP/ViewSDP";
import UpdateSDP from "./Component/Staff/SDP/UpdateSDP";
import Login from "./Component/Login/Login";
import FDPHoDList from "./Component/HOD/FDP/FDPListHod";
import ConferencesListHod from "./Component/HOD/Research/Publications/Conferance/ConferencesListHod";
import JournalsListHod from "./Component/HOD/Research/Publications/Journal/JournalList";
import PatentsListHod from "./Component/HOD/Research/Patent/PatentList";
import ProposalsListHod from "./Component/HOD/Research/Praposal/Praposal_List";
import SDPListHod from "./Component/HOD/SDP/SDPList";
import CopyrightListHod from "./Component/HOD/Research/Copyright/CopyrightList";
import ViewSDPHod from "./Component/HOD/SDP/ViewSDP";
import ViewFDPHOD from "./Component/HOD/FDP/ViewFDPHOD";
import ViewPatentHod from "./Component/HOD/Research/Patent/ViewPatent";
import ViewConferanceHOD from "./Component/HOD/Research/Publications/Conferance/ViewConferanceHOD";
import ViewJournalHod from "./Component/HOD/Research/Publications/Journal/ViewJournal";
import ViewProposalHod from "./Component/HOD/Research/Praposal/ViewPraposal";
import ViewCopyrightHod from "./Component/HOD/Research/Copyright/ViewCopyright";

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/faculty"
              element={<ProtectedRoute element={<StaffLayout />} />}
            />

            <Route
              path="/add/conference"
              element={<ProtectedRoute element={<AddConference />} />}
            />

            <Route
              path="/conference/list"
              element={<ProtectedRoute element={<ConferencesList />} />}
            />

            <Route
              path="/conferences/view/"
              element={<ProtectedRoute element={<ViewConference />} />}
            />

            <Route
              path="/conferences/update/"
              element={<ProtectedRoute element={<UpdateConference />} />}
            />

            <Route
              path="/add/journal"
              element={<ProtectedRoute element={<AddJournal />} />}
            />

            <Route
              path="/journal/list"
              element={<ProtectedRoute element={<JournalsList />} />}
            />

            <Route
              path="/journal/view/"
              element={<ProtectedRoute element={<ViewJournal />} />}
            />

            <Route
              path="/journal/update/"
              element={<ProtectedRoute element={<UpdateJournal />} />}
            />

            <Route
              path="/add/praposal"
              element={<ProtectedRoute element={<AddProposal />} />}
            />

            <Route
              path="/praposal/list"
              element={<ProtectedRoute element={<ProposalsList />} />}
            />

            <Route
              path="/praposal/view"
              element={<ProtectedRoute element={<ViewProposal />} />}
            />

            <Route
              path="/praposal/update/"
              element={<ProtectedRoute element={<UpdateProposal />} />}
            />

            <Route
              path="/add/patent"
              element={<ProtectedRoute element={<AddPatent />} />}
            />

            <Route
              path="/patent/list"
              element={<ProtectedRoute element={<PatentsList />} />}
            />

            <Route
              path="/patent/view"
              element={<ProtectedRoute element={<ViewPatent />} />}
            />

            <Route
              path="/patent/update/"
              element={<ProtectedRoute element={<UpdatePatent />} />}
            />

            <Route
              path="/add/copyright"
              element={<ProtectedRoute element={<AddCopyright />} />}
            />

            <Route
              path="/copyright/list"
              element={<ProtectedRoute element={<CopyrightList />} />}
            />

            <Route
              path="/copyright/view"
              element={<ProtectedRoute element={<ViewCopyright />} />}
            />

            <Route
              path="/copyright/update/"
              element={<ProtectedRoute element={<UpdateCopyright />} />}
            />

            <Route
              path="/add/fdp"
              element={<ProtectedRoute element={<AddFDP />} />}
            />

            <Route
              path="/fdp/list"
              element={<ProtectedRoute element={<FDPList />} />}
            />

            <Route
              path="/fdp/view"
              element={<ProtectedRoute element={<ViewFDP />} />}
            />

            <Route
              path="/fdp/update/"
              element={<ProtectedRoute element={<UpdateFDP />} />}
            />

            <Route
              path="/add/sdp"
              element={<ProtectedRoute element={<AddSDP />} />}
            />

            <Route
              path="/sdp/list"
              element={<ProtectedRoute element={<SDPList />} />}
            />

            <Route
              path="/sdp/view"
              element={<ProtectedRoute element={<ViewSDP />} />}
            />

            <Route
              path="/sdp/update/"
              element={<ProtectedRoute element={<UpdateSDP />} />}
            />

            <Route
              path="/fdp/hod/"
              element={<ProtectedRoute element={<FDPHoDList />} />}
            />

            <Route
              path="/sdp/hod/"
              element={<ProtectedRoute element={<SDPListHod />} />}
            />

            <Route
              path="/conferance/hod/"
              element={<ProtectedRoute element={<ConferencesListHod />} />}
            />

            <Route
              path="/journal/hod/"
              element={<ProtectedRoute element={<JournalsListHod />} />}
            />
            <Route
              path="/patent/hod/"
              element={<ProtectedRoute element={<PatentsListHod />} />}
            />

            <Route
              path="/praposal/hod/"
              element={<ProtectedRoute element={<ProposalsListHod />} />}
            />

            <Route
              path="/copyright/hod/"
              element={<ProtectedRoute element={<CopyrightListHod />} />}
            />

<Route
              path="/sdp/view/hod"
              element={<ProtectedRoute element={<ViewSDPHod />} />}
            />

<Route
              path="/fdp/view/hod"
              element={<ProtectedRoute element={<ViewFDPHOD />} />}
            />

<Route
              path="/patent/view/hod"
              element={<ProtectedRoute element={<ViewPatentHod />} />}
            />

<Route
              path="/conference/view/hod"
              element={<ProtectedRoute element={<ViewConferanceHOD />} />}
            />

<Route
              path="/journal/view/hod"
              element={<ProtectedRoute element={<ViewJournalHod />} />}
            />

<Route
              path="/praposal/view/hod"
              element={<ProtectedRoute element={<ViewProposalHod />} />}
            />

<Route
              path="/copyright/view/hod"
              element={<ProtectedRoute element={<ViewCopyrightHod />} />}
            />



          </Routes>
        </Router>
      </div>
    </AppProvider>
  );
}

export default App;
