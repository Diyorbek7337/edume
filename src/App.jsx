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
const Pricing       = lazy(() => import('./pages/Pricing'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loading size="lg" text="Yuklanmoqda..." />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
                {/* allowedModule faqat 'admin' roliga ta'sir qiladi (ProtectedRoute'ga qarang) —
                    o'qituvchi/o'quvchi/ota-ona uchun bu yo'llar ochiqligicha qoladi. */}
                <Route path="messages"      element={<ProtectedRoute allowedModule="messages"><ErrorBoundary><Messages /></ErrorBoundary></ProtectedRoute>} />
                <Route path="schedule"      element={<ProtectedRoute allowedModule="schedule"><ErrorBoundary><Schedule /></ErrorBoundary></ProtectedRoute>} />
                <Route path="leaderboard"   element={<ProtectedRoute allowedModule="leaderboard"><ErrorBoundary><Leaderboard /></ErrorBoundary></ProtectedRoute>} />
                <Route path="materials"     element={<ProtectedRoute allowedModule="materials"><ErrorBoundary><Materials /></ErrorBoundary></ProtectedRoute>} />
                <Route path="rewards"       element={<ProtectedRoute allowedModule="rewards"><ErrorBoundary><RewardsShop /></ErrorBoundary></ProtectedRoute>} />
                <Route path="certificates"  element={<ProtectedRoute allowedModule="certificates"><ErrorBoundary><Certificates /></ErrorBoundary></ProtectedRoute>} />
                <Route path="homework"      element={<ProtectedRoute allowedModule="homework"><ErrorBoundary><Homework /></ErrorBoundary></ProtectedRoute>} />
                <Route path="quizzes"       element={<ProtectedRoute allowedModule="quizzes"><ErrorBoundary><Quizzes /></ErrorBoundary></ProtectedRoute>} />
                <Route path="chat"          element={<ProtectedRoute allowedModule="chat"><ErrorBoundary><GroupChat /></ErrorBoundary></ProtectedRoute>} />
                <Route path="pdf-reports"   element={<ProtectedRoute allowedModule="pdf-reports"><ErrorBoundary><PDFReports /></ErrorBoundary></ProtectedRoute>} />

                {/* Director only */}
                <Route path="admins"       element={<ProtectedRoute allowedRoles={['director']}><ErrorBoundary><Admins /></ErrorBoundary></ProtectedRoute>} />
                <Route path="settings"     element={<ProtectedRoute allowedRoles={['director']}><ErrorBoundary><Settings /></ErrorBoundary></ProtectedRoute>} />
                {/* Tarif — faqat direktor: obunani faqat u o'zgartira oladi */}
                <Route path="pricing"      element={<ProtectedRoute allowedRoles={['director']}><ErrorBoundary><Pricing /></ErrorBoundary></ProtectedRoute>} />
                <Route path="activity-log" element={<ProtectedRoute allowedRoles={['director']}><ErrorBoundary><ActivityLog /></ErrorBoundary></ProtectedRoute>} />
                <Route path="expenses"     element={<ProtectedRoute allowedRoles={['director', 'admin']} allowedModule="expenses"><ErrorBoundary><Expenses /></ErrorBoundary></ProtectedRoute>} />
                <Route path="reports"      element={<ProtectedRoute allowedRoles={['director', 'admin']} allowedModule="reports"><ErrorBoundary><Reports /></ErrorBoundary></ProtectedRoute>} />

                {/* Admin/Director/Teacher */}
                <Route path="students"        element={<ProtectedRoute allowedModule="students"><ErrorBoundary><Students /></ErrorBoundary></ProtectedRoute>} />
                <Route path="teachers"        element={<ProtectedRoute allowedModule="teachers"><ErrorBoundary><Teachers /></ErrorBoundary></ProtectedRoute>} />
                <Route path="groups"          element={<ProtectedRoute allowedModule="groups"><ErrorBoundary><Groups /></ErrorBoundary></ProtectedRoute>} />
                <Route path="leads"           element={<ProtectedRoute allowedModule="leads"><ErrorBoundary><Leads /></ErrorBoundary></ProtectedRoute>} />
                <Route path="payments"        element={<ProtectedRoute allowedModule="payments"><ErrorBoundary><Payments /></ErrorBoundary></ProtectedRoute>} />
                <Route path="attendance"      element={<ProtectedRoute allowedModule="attendance"><ErrorBoundary><Attendance /></ErrorBoundary></ProtectedRoute>} />
                <Route path="grades"          element={<ProtectedRoute allowedModule="grades"><ErrorBoundary><Grades /></ErrorBoundary></ProtectedRoute>} />
                <Route path="teacher-ratings" element={<ProtectedRoute allowedModule="teacher-ratings"><ErrorBoundary><TeacherRatings /></ErrorBoundary></ProtectedRoute>} />

                {/* Teacher aliases — asosiy yo'l bilan bir xil modul cheklovi, aks holda
                    cheklangan admin /students o'rniga /my-students orqali chetlab o'tardi */}
                <Route path="my-groups"   element={<ProtectedRoute allowedModule="groups"><ErrorBoundary><Groups /></ErrorBoundary></ProtectedRoute>} />
                <Route path="my-students" element={<ProtectedRoute allowedModule="students"><ErrorBoundary><Students /></ErrorBoundary></ProtectedRoute>} />

                {/* Parent/Student */}
                <Route path="parent"       element={<ErrorBoundary><ParentPortal /></ErrorBoundary>} />
                <Route path="my-progress"  element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                <Route path="my-grades"    element={<ProtectedRoute allowedModule="grades"><ErrorBoundary><Grades /></ErrorBoundary></ProtectedRoute>} />
                <Route path="my-attendance" element={<ProtectedRoute allowedModule="attendance"><ErrorBoundary><Attendance /></ErrorBoundary></ProtectedRoute>} />
                <Route path="my-payments"  element={<ProtectedRoute allowedModule="payments"><ErrorBoundary><Payments /></ErrorBoundary></ProtectedRoute>} />
                <Route path="feedback"     element={<ProtectedRoute allowedModule="messages"><ErrorBoundary><Messages /></ErrorBoundary></ProtectedRoute>} />
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
