import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Home from "./pages/auth/Home";
import Dashboard from "./pages/DashBoard/Dashboard";
import AdminPanel from "./pages/admin/AdminPanel";
import UploadPage from "./pages/DashBoard/UploadPage";
import HistoryPage from "./pages/DashBoard/HistoryPage";
import x from "./assets/x.png";

//  Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

//  Navbar
const Nav = () => (
  <nav className="flex items-center justify-between p-4 bg-white border-0 shadow ">
    <div className="text-xl font-bold text-green-900 flex items-center gap-2">
      <img src={x} alt="Logo" className="w-10 h-6" />
      Excel Analytics
    </div>
    <div className="flex items-center space-x-5">
      <Link to="/home" className="text-sm hover:underline">🏠 <b>Home</b></Link>
      <Link to="/dashboard" className="text-sm hover:underline"><b>Dashboard</b></Link>
      <Link to="/admin" className="text-sm hover:underline"><b>Admin</b></Link>
      <Link to="/upload" className="text-sm hover:underline"><b>Upload</b></Link>
      <Link to="/dashboard/history" className="text-sm hover:underline"><b>History</b></Link>
      <Link to="/login" className="text-sm hover:underline"><b>Login</b></Link>
      <Link to="/signup" className="text-sm hover:underline"><b>Signup</b></Link>
      <button
        className="text-sm hover:underline"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        <b>Logout</b>
      </button>
    </div>
  </nav>
);

//  App
function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login setRole={setRole} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/dashboard/upload" element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>} />
            <Route path="/dashboard/history" element={<HistoryPage />} />
            <Route path="/admin" element={role === "admin" ? <AdminPanel /> : <Navigate to="/login" />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
