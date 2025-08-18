import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Header from "./components/header/Header";
import SignUpPage from "./pages/SignUpPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import ProjectPage from "./pages/ProjectPage";
import NetworkPage from "./pages/NetworkPage";
import FeedbackPage from "./pages/FeedbackPage";
import StatusPage from "./pages/StatusPage";
import SubmitStatusReport from "./pages/SubmitStatusPage";
import StatusReportPage from "./pages/StatusReportPage";
import RequestFeedbackPage from "./pages/RequestFeedbackPage";
import UserConnectionPage from "./pages/UserConnectionPage";
import FeedbackReceivedDetailModelPage from "./pages/FeedbackReceivedDetailModelPage";
import FeedbackReceivedDetailPage from "./pages/FeedbackReceivedDetailPage";
import GroupPage from "./pages/GroupPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import MonitoringGroupDetailPage from "./pages/MonitoringGroupDetailPage";
import EditProfilePage from "./pages/EditProfilePage";
import MyProfilePage from "./pages/MyProfilePage";
import ManageRelationPage from "./pages/ManageRelationPage";
import AddParentPage from "./pages/AddParentPage";
import EditParentPage from "./pages/EditParentPage";

import PaymentPage from "./pages/PaymentPage";
import SolutionFunctionPage from "./pages/SolutionFunctionPage";
import { ToastContainer } from "react-toastify";
import ForgotPasswordVerify from "./pages/ForgotPasswordVerify";
import PublicRoute from "./components/PublicRoute/Publicroute";
import VerifyCodeChild from "./pages/verifyCodeChild";
import RoleBasedRoute from "./components/RoleBasedRoute";
// import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/create-account"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path="/complete-profile"
          element={
            <PublicRoute>
              <CompleteProfilePage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password-verify"
          element={
            <PublicRoute>
              <ForgotPasswordVerify />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <VerifyCodePage />
            </PublicRoute>
          }
        />
        <Route path="/verify-otp-data" element={<VerifyCodeChild />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/network" element={<NetworkPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/status-report" element={<StatusReportPage />} />
        <Route path="/status-report-submission" element={<SubmitStatusReport />} />
        <Route path="/request-feedback" element={<RequestFeedbackPage />} />
        <Route path="/user-connection" element={<UserConnectionPage />} />
        <Route path="/feedback-received-model" element={<FeedbackReceivedDetailModelPage />} />
        <Route path="/feedback-received-detail" element={<FeedbackReceivedDetailPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/manage-relation" element={<ManageRelationPage />} />
        <Route 
          path="/groups" 
          element={
            <RoleBasedRoute requiredModule="groups">
              <GroupPage />
            </RoleBasedRoute>
          } 
        />
        <Route 
          path="/groups/:groupId" 
          element={
            <RoleBasedRoute requiredModule="groups">
              <GroupDetailPage />
            </RoleBasedRoute>
          } 
        />
        <Route 
          path="/monitoring-groups/:groupId" 
          element={
            <RoleBasedRoute requiredPermission="CREATE_MONITORING_GROUP">
              <MonitoringGroupDetailPage />
            </RoleBasedRoute>
          } 
        />
        <Route 
          path="/add-parent" 
          element={
            <RoleBasedRoute requiredPermission="ADD_CHILDREN">
              <AddParentPage />
            </RoleBasedRoute>
          } 
        />
        <Route path="/edit-parent/:parentId" element={<EditParentPage />} />

        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/solution-function" element={<SolutionFunctionPage />} />
      </Routes>
    </>
  );
}

export default App;
