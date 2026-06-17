import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/ErrorBoundary';

// Darhol kerak bo'lgan komponentlar — eager
import Login from './components/auth/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

const ChangePassword = lazy(() => import('./pages/ChangePassword'));

// Sahifalar — faqat kerak bo'lganda yuklanadi (code splitting)
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const SuperAdmin    = lazy(() => import('./pages/SuperAdmin'));
const Admins        = lazy(() => import('./pages/Admins'));
const Students      = lazy(() => import('./pages/Students'));
const Teachers      = lazy(() => import('./pages/Teachers'));
const Groups        = lazy(() => import('./pages/Groups'));
const Leads         = lazy(() => import('./pages/Leads'));
const Payments      = lazy(() => import('./pages/Payments'));
const Attendance    = lazy(() => import('./pages/Attendance'));
const Grades        = lazy(() => import('./pages/Grades'));
const Messages      = lazy(() => import('./pages/Messages'));
const Settings      = lazy(() => import('./pages/Settings'));
const Profile       = lazy(() => import('./pages/Profile'));
const Reports       = lazy(() => import('./pages/Reports'));
const Schedule      = lazy(() => import('./pages/Schedule'));
const TeacherRatings = lazy(() => import('./pages/TeacherRatings'));
const Homework      = lazy(() => import('./pages/Homework'));
const GroupChat     = lazy(() => import('./pages/GroupChat'));
const Quizzes       = lazy(() => import('./pages/Quizzes'));
const PDFReports    = lazy(() => import('./pages/PDFReports'));
const Leaderboard   = lazy(() => import('./pages/Leaderboard'));
const Materials     = lazy(() => import('./pages/Materials'));
const RewardsShop   = lazy(() => import('./pages/RewardsShop'));
const Certificates  = lazy(() => import('./pages/Certificates'));
const ActivityLog   = lazy(() => import('./pages/ActivityLog'));
const ParentPortal  = lazy(() => import('./pages/ParentPortal'));
const Expenses      = lazy(() => import('./pages/Expenses'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loading size="lg" text="Yuklanmoqda..." />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

              {/* Super Admin */}
              <Route path="/super-admin" element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <SuperAdmin />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />

              {/* Protected */}
              <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />

                <Route path="dashboard"     element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                <Route path="profile"       element={<ErrorBoundary><Profile /></ErrorBoundary>} />
                <Route path="messages"      element={<ErrorBoundary><Messages /></ErrorBoundary>} />
                <Route path="schedule"      element={<ErrorBoundary><Schedule /></ErrorBoundary>} />
                <Route path="leaderboard"   element={<ErrorBoundary><Leaderboard /></ErrorBoundary>} />
                <Route path="materials"     element={<ErrorBoundary><Materials /></ErrorBoundary>} />
                <Route path="rewards"       element={<ErrorBoundary><RewardsShop /></ErrorBoundary>} />
                <Route path="certificates"  element={<ErrorBoundary><Certificates /></ErrorBoundary>} />
                <Route path="homework"      element={<ErrorBoundary><Homework /></ErrorBoundary>} />
                <Route path="quizzes"       element={<ErrorBoundary><Quizzes /></ErrorBoundary>} />
                <Route path="chat"          element={<ErrorBoundary><GroupChat /></ErrorBoundary>} />
                <Route path="pdf-reports"   element={<ErrorBoundary><PDFReports /></ErrorBoundary>} />

                {/* Director only */}
                <Route path="admins"       element={<ProtectedRoute allowedRoles={['director']}><ErrorBoundary><Admins /></ErrorBoundary></ProtectedRoute>} />
                <Route path="settings"     element={<ProtectedRoute allowedRoles={['director']}><ErrorBoundary><Settings /></ErrorBoundary></ProtectedRoute>} />
                <Route path="activity-log" element={<ProtectedRoute allowedRoles={['director']}><ErrorBoundary><ActivityLog /></ErrorBoundary></ProtectedRoute>} />
                <Route path="expenses"     element={<ProtectedRoute allowedRoles={['director', 'admin']}><ErrorBoundary><Expenses /></ErrorBoundary></ProtectedRoute>} />
                <Route path="reports"      element={<ProtectedRoute allowedRoles={['director', 'admin']}><ErrorBoundary><Reports /></ErrorBoundary></ProtectedRoute>} />

                {/* Admin/Director/Teacher */}
                <Route path="students"        element={<ErrorBoundary><Students /></ErrorBoundary>} />
                <Route path="teachers"        element={<ErrorBoundary><Teachers /></ErrorBoundary>} />
                <Route path="groups"          element={<ErrorBoundary><Groups /></ErrorBoundary>} />
                <Route path="leads"           element={<ErrorBoundary><Leads /></ErrorBoundary>} />
                <Route path="payments"        element={<ErrorBoundary><Payments /></ErrorBoundary>} />
                <Route path="attendance"      element={<ErrorBoundary><Attendance /></ErrorBoundary>} />
                <Route path="grades"          element={<ErrorBoundary><Grades /></ErrorBoundary>} />
                <Route path="teacher-ratings" element={<ErrorBoundary><TeacherRatings /></ErrorBoundary>} />

                {/* Teacher aliases */}
                <Route path="my-groups"   element={<ErrorBoundary><Groups /></ErrorBoundary>} />
                <Route path="my-students" element={<ErrorBoundary><Students /></ErrorBoundary>} />

                {/* Parent/Student */}
                <Route path="parent"       element={<ErrorBoundary><ParentPortal /></ErrorBoundary>} />
                <Route path="my-progress"  element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                <Route path="my-grades"    element={<ErrorBoundary><Grades /></ErrorBoundary>} />
                <Route path="my-attendance" element={<ErrorBoundary><Attendance /></ErrorBoundary>} />
                <Route path="my-payments"  element={<ErrorBoundary><Payments /></ErrorBoundary>} />
                <Route path="feedback"     element={<ErrorBoundary><Messages /></ErrorBoundary>} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
