import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { useContext, useState } from "react";
import {  AuthContext } from "./context/AuthContext";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Home from "./pages/auth/Home";
import Dashboard from "./pages/DashBoard/Dashboard";
import AdminPanel from "./pages/admin/AdminPanel";
import UploadPage from "./pages/DashBoard/UploadPage";
import Nav from "./components/Navbar";
import HistoryPage from "./pages/DashBoard/HistoryPage";
import Charts from "./pages/DashBoard/Charts"
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SmartInsight from "./pages/DashBoard/SmartInsight";
import AccountSettings from "./pages/DashBoard/AccountSettings";

//  Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};


//  App
function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
      {/* auth route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

     {/* upload Route*/}
        <Route path="/upload" element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>}
           />

     {/* dashboard route */}
        <Route path="/dashboard/upload" element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>} 
          />

        <Route path="/dashboard/history" element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>}
           />

        <Route path="/dashboard/charts"
              element={
                <ProtectedRoute>
                  <Charts />
                </ProtectedRoute>
               }
              />
        <Route path="/dashboard/insight"
              element={
                <ProtectedRoute>
                  <SmartInsight />
                </ProtectedRoute>
               }
              />
        <Route path="/smart-insight"
              element={
                <ProtectedRoute>
                  <SmartInsight />
                </ProtectedRoute>
               }
              />
        <Route path="/account-settings"
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
               }
              />
     {/* usere || admin route */}
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
  );
}


export default App;
