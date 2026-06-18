import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DiscoveryDashboard from "./components/DiscoveryDashboard";
import DailyOverview from "./components/DailyOverview";

// Auth pages
const Login           = lazy(() => import("./components/Credential/Login"));
const VerifyEmail     = lazy(() => import("./components/Credential/VerifyEmail"));
const RoleSelect      = lazy(() => import("./components/Credential/RoleSelect"));
const RegisterIntern  = lazy(() => import("./components/Credential/RegisterIntern"));
const RegisterCompany = lazy(() => import("./components/Credential/RegisterCompany"));
const RegisterSchool  = lazy(() => import("./components/Credential/RegisterSchool"));
const ForgotPassword  = lazy(() => import("./components/Credential/ForgotPassword"));
const ResetPassword   = lazy(() => import("./components/Credential/ResetPassword"));
const PendingApproval = lazy(() => import("./components/Credential/PendingApproval"));

// Dashboard
const Dashboard = lazy(() => import("./components/Dashboard"));

// Company
const CompanyDashboard = lazy(() => import("./components/company/CompanyDashboard"));
const InternManagement   = lazy(() => import("./components/company/InternManagement"));
const SlotsManagement     = lazy(() => import("./components/company/SlotsManagement"));
const CompanyApplications = lazy(() => import("./components/company/ApplicationsReview")); // changed name to avoid clash with admin import
const TaskManagement      = lazy(() => import("./components/company/TaskManagement"));
const SubmissionReview    = lazy(() => import("./components/company/SubmissionReview"));
const SessionsManagement  = lazy(() => import("./components/company/SessionsManagement")); 
const CompanyAnalytics       = lazy(() => import("./components/company/CompanyAnalytics"));
const CompanyFeedback        = lazy(() => import("./components/company/FeedbackManagement"));
const CompanySettings        = lazy(() => import("./components/company/CompanySettings"));



// Admin pages
const AdminLayout           = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard        = lazy(() => import("./components/admin/AdminDashboard"));
const UserManagement        = lazy(() => import("./components/admin/UserManagement"));
const ApplicationsReview    = lazy(() => import("./components/admin/ApplicationsReview"));
const CompanyApprovals      = lazy(() => import("./components/admin/CompanyApprovals"));
const SchoolApprovals       = lazy(() => import("./components/admin/SchoolApprovals"));
const CohortAnalytics       = lazy(() => import("./components/admin/CohortAnalytics"));
const CertificateManagement = lazy(() => import("./components/admin/CertificateManagement"));
const ResourceManagement    = lazy(() => import("./components/admin/ResourceManagement"));
const FeedbackOverview      = lazy(() => import("./components/admin/FeedbackOverview"));
const PlatformSettings      = lazy(() => import("./components/admin/PlatformSettings"));
const MentorManagement      = lazy(() => import("./components/admin/MentorManagement"));
const PlacementManagement   = lazy(() => import("./components/admin/PlacementManagement"));
const NotificationsCenter   = lazy(() => import("./components/admin/NotificationsCenter"));
const GamificationAdmin     = lazy(() => import("./components/admin/GamificationAdmin"));
const SlotManagement        = lazy(() => import("./components/admin/SlotManagement"));

// Intern
const InternProfile         = lazy(() => import("./components/InternProfile"));

// Portfolio
const PortfolioSubmit       = lazy(() => import("./components/portfolio/PortfolioSubmit"));
const AdminPortfolioBuilder = lazy(() => import("./components/portfolio/AdminPortfolioBuilder"));
const PublicPortfolioView   = lazy(() => import("./components/portfolio/PublicPortfolioView"));

// Intern dashboard pages (Hosea's PR)
const Onboarding    = lazy(() => import("./components/Onboarding"));
const Roadmap       = lazy(() => import("./components/Roadmap"));
const Tasks         = lazy(() => import("./components/Tasks"));
const TaskTracker   = lazy(() => import("./components/TaskTracker"));
const Mentors       = lazy(() => import("./components/Mentors"));
const Leaderboard   = lazy(() => import("./components/Leaderboard"));
const Progress      = lazy(() => import("./components/Progress"));
const Feedback      = lazy(() => import("./components/Feedback"));
const SubmissionHub = lazy(() => import("./components/SubmissionHub"));

//School dashboard pages 
const SchoolDashboard = lazy(() => import("./components/school/SchoolDashboard"));

// Placeholder for pages not yet built
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col justify-center items-center py-24 h-full text-center">
    <p className="mb-4 text-4xl">🚧</p>
    <h1 className="mb-2 font-bold text-black text-2xl">{title}</h1>
    <p className="text-gray-400 text-sm">This page is coming soon.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="flex justify-center items-center bg-[#12022A] min-h-screen">
          <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
        </div>
      }>
        <Routes>

          {/* ── Public routes ───────────────────────────────────────────── */}
          <Route path="/"                 element={<Login />} />
          <Route path="/login"            element={<Login />} />
          <Route path="/register"         element={<RoleSelect />} />
          <Route path="/register/intern"  element={<RegisterIntern />} />
          <Route path="/register/company" element={<RegisterCompany />} />
          <Route path="/register/school"  element={<RegisterSchool />} />
          <Route path="/forgot-password"  element={<ForgotPassword />} />
          <Route path="/reset-password"   element={<ResetPassword />} />
          <Route path="/verify-email"     element={<VerifyEmail />} />

          {/* ── Pending approval ─────────────────────────────────────────── */}
          <Route path="/pending-approval" element={<PendingApproval />} />
 
          {/* ── Company-only routes ──────────────────────────────────────── */}
          <Route path="/company" element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyDashboard />
        
            </ProtectedRoute>
            
          } />

          <Route path="/company/interns" element={
            <ProtectedRoute allowedRoles={["company"]}>
              <InternManagement />
            </ProtectedRoute>
          } />

          <Route path="/company/slots" element={
            <ProtectedRoute allowedRoles={["company"]}>
              <SlotsManagement />
            </ProtectedRoute>
          } />

          <Route path="/company/applications" element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyApplications />
            </ProtectedRoute>
          } />

          <Route path="/company/tasks" element={
            <ProtectedRoute allowedRoles={["company"]}>
              <TaskManagement />
            </ProtectedRoute>
          } />

          <Route path="/company/submissions" element={
            <ProtectedRoute allowedRoles={["company"]}>
              <SubmissionReview />
            </ProtectedRoute>
          } />

          <Route path="/company/sessions" element={
            <ProtectedRoute allowedRoles={["company"]}>
              <SessionsManagement />
            </ProtectedRoute>
          } />

          <Route path="/company/analytics" element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyAnalytics />
            </ProtectedRoute>
          } />

          <Route path="/company/feedback" element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyFeedback />
            </ProtectedRoute>
          } />

          <Route path="/company/settings" element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanySettings />
            </ProtectedRoute>
          } />

          <Route path="/company/portfolio" element={
            <ProtectedRoute allowedRoles={["company", "admin"]}>
              <PublicPortfolioView />
            </ProtectedRoute>
          } />
          

          {/* ── Intern dashboard ─────────────────────────────────────────── */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index                  element={<DailyOverview />} />
            <Route path="overview"        element={<DailyOverview />} />
            <Route path="discovery"       element={<DiscoveryDashboard />} />
            <Route path="onboarding"      element={<Onboarding />} />
            <Route path="roadmap"         element={<Roadmap />} />
            <Route path="tasks"           element={<Tasks />} />
            <Route path="task-tracker"    element={<TaskTracker />} />
            <Route path="mentors"         element={<Mentors />} />
            <Route path="community"       element={<Placeholder title="Community" />} />
            <Route path="portfolio"       element={<PortfolioSubmit />} />
            <Route path="profile"         element={<InternProfile />} />
            <Route path="career"          element={<Placeholder title="Career" />} />
            <Route path="leaderboard"     element={<Leaderboard />} />
            <Route path="progress"        element={<Progress />} />
            <Route path="feedback"        element={<Feedback />} />
            <Route path="submission-hub"  element={<SubmissionHub />} />
            <Route path="certificates"    element={<Placeholder title="Certificates" />} />
            <Route path="checkins"        element={<Placeholder title="Check-ins" />} />
          </Route>

          {/* ── Admin dashboard ──────────────────────────────────────────── */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index                    element={<AdminDashboard />} />
            <Route path="dashboard"         element={<AdminDashboard />} />
            <Route path="users"             element={<UserManagement />} />
            <Route path="applications"      element={<ApplicationsReview />} />
            <Route path="companies"         element={<CompanyApprovals />} />
            <Route path="schools"           element={<SchoolApprovals />} />
            <Route path="analytics"         element={<CohortAnalytics />} />
            <Route path="certificates"      element={<CertificateManagement />} />
            <Route path="resources"         element={<ResourceManagement />} />
            <Route path="feedback"          element={<FeedbackOverview />} />
            <Route path="settings"          element={<PlatformSettings />} />
            <Route path="portfolio"         element={<AdminPortfolioBuilder />} />
            <Route path="mentors"           element={<MentorManagement />} />
            <Route path="placements"        element={<PlacementManagement />} />
            <Route path="notifications"     element={<NotificationsCenter />} />
            <Route path="gamification"      element={<GamificationAdmin />} />
            <Route path="slots"             element={<SlotManagement />} />
          </Route>
          
          {/* ── School dashboard ──────────────────────────────────────────── */}
          <Route path="/school" element={<SchoolDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
