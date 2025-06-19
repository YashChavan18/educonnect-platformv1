import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';

// Components...
import Home from './components/pages/Home';
import LoginPage from './components/pages/Login';
import SignupPage from './components/pages/Signup';
import TutorDashboard from './components/pages/tutor/TutorDashboard';
import OrgDashboard from './components/pages/organization/OrgDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirector from './components/DashboardRedirector';
import ProfilePage from './components/pages/PorfilePage';
import PostOpportunity from './components/pages/organization/PostOpportunity';
import FindOpportunities from './components/pages/tutor/FindOpportunities';
import ViewApplicants from './components/pages/organization/ViewApplicants';
import PostedOpportunities from './components/pages/organization/PostedOpportunities';
import AppliedOpportunities from './components/pages/tutor/AppliedOpportunities';
import ApplicantProfile from './components/pages/organization/ApplicantProfile';
import OpportunityDetails from './components/pages/tutor/OpportunityDetails';
function App() {
  return (
    <ChakraProvider>
      <AuthProvider> 
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardRedirector />} />
              <Route path="/tutor" element={<TutorDashboard />} />
              <Route path="/organization" element={<OrgDashboard />} />
              <Route path="/post-opportunity" element={<PostOpportunity />} />
              <Route path="/find-opportunities" element={<FindOpportunities />} />
              <Route path="/view-applicants/:opportunityId" element={<ViewApplicants />} />
              <Route path="/posted-opportunities" element={<PostedOpportunities />} />
              <Route path="/applied-opportunities" element={<AppliedOpportunities />} />
              <Route path="/applicant-profile/:applicantId" element={<ApplicantProfile />} />
              <Route path="/opportunity-details/:opportunityId" element={<OpportunityDetails />} />

            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
