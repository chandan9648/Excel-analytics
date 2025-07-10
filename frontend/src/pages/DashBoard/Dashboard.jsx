
import React from "react";

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

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
          <li>User Radhika uploaded an Excel file.</li>
          <li>Admin generated a summary report.</li>
          <li>New user registered: rahul@gmail.com</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
