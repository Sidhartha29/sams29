import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import DashboardLayout from "./components/DashboardLayout";
import AdminDashboardLayout from "./components/AdminDashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminAuth from "./pages/AdminAuth";
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import AddAchievement from "./pages/student/AddAchievement";
import ViewAchievements from "./pages/student/ViewAchievements";
import UploadDocument from "./pages/student/UploadDocument";
import MyDocuments from "./pages/student/MyDocuments";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminStudentDetail from "./pages/admin/AdminStudentDetail";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminAchievements from "./pages/admin/AdminAchievements";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/role-selection" replace />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Register />} />
        <Route path="/admin/auth" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <AdminAuth />} />

        {/* Student routes */}
        <Route element={<ProtectedRoute role="student"><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<ViewAchievements />} />
          <Route path="/achievements/add" element={<AddAchievement />} />
          <Route path="/documents" element={<MyDocuments />} />
          <Route path="/documents/upload" element={<UploadDocument />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute role="admin"><AdminDashboardLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="/admin/achievements" element={<AdminAchievements />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

