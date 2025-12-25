import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Import Pages
import Login from "./pages/Login";
import AdminDash from "./pages/AdminDash";
import TeacherDash from "./pages/TeacherDash";
import StudentDash from "./pages/StudentDash";
import Unauthorized from "./pages/Unauthorized";

// 1. Protected Route Wrapper Component
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait for AuthContext to finish reading from localStorage
  if (loading) return <div>Loading...</div>;

  if (!user) {
    // If not logged in, send to login
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // If logged in but wrong role, send to unauthorized
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// 2. Main App Component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes - MATCHING LOGIN.JS PATHS */}
        <Route
          path="/admin-dash"
          element={
            <ProtectedRoute role="Admin">
              <AdminDash />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes - MATCHING LOGIN.JS PATHS */}
        <Route
          path="/teacher-dash"
          element={
            <ProtectedRoute role="Teacher">
              <TeacherDash />
            </ProtectedRoute>
          }
        />

        {/* Student Routes - MATCHING LOGIN.JS PATHS */}
        <Route
          path="/student-dash"
          element={
            <ProtectedRoute role="Student">
              <StudentDash />
            </ProtectedRoute>
          }
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/unauthorized" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;