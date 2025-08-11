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

//  Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};


//  App
function App() {
  // const { loading } = useContext(AuthContext); 
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen text-lg text-gray-700">
  //       Checking authentication...
  //     </div>
  //   );
  // }

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>}
           />
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
