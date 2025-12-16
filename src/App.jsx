import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Auth
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout
import  DashboardLayout  from './components/layout/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Admins from './pages/Admins';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Groups from './pages/Groups';
import Leads from './pages/Leads';
import Payments from './pages/Payments';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Schedule from './pages/Schedule';
import TeacherRatings from './pages/TeacherRatings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Director only */}
            <Route path="admins" element={<Admins />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Admin/Director routes */}
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="groups" element={<Groups />} />
            <Route path="leads" element={<Leads />} />
            <Route path="payments" element={<Payments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="grades" element={<Grades />} />
            <Route path="messages" element={<Messages />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="teacher-ratings" element={<TeacherRatings />} />
            
            {/* Teacher routes */}
            <Route path="my-groups" element={<Groups />} />
            <Route path="my-students" element={<Students />} />
            
            {/* Student/Parent routes */}
            <Route path="my-progress" element={<Dashboard />} />
            <Route path="my-grades" element={<Grades />} />
            <Route path="my-attendance" element={<Attendance />} />
            <Route path="my-payments" element={<Payments />} />
            <Route path="feedback" element={<Messages />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
