import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" />;

  const handleLogout = () => {
    logout();           // clear token + context
    navigate("/login"); // redirect to login
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Welcome, {user?.email || "User"}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-gray-500 text-sm mt-2">Total: 120</p>
        </div>

        <div className="p-4 bg-green-100 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Reports</h2>
          <p className="text-gray-500 text-sm mt-2">Generated: 45</p>
        </div>

        <div className="p-4 bg-green-100 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Files Uploaded</h2>
          <p className="text-gray-500 text-sm mt-2">This Month: 30</p>
        </div>
      </div>

      <div className="mt-8 bg-green-100 shadow p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>User Chandan uploaded an Excel file.</li>
          <li>Admin generated a summary report.</li>
          <li>New user registered: example@gmail.com</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
