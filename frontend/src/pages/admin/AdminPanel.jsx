import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaUser, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`, // 🔑 header bhejo
          "Content-Type": "application/json",
        },
      });

      if (!res) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed! Status: ${res.status}`);
      }
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted Successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete User!");
    }
  };

  const refresh = () => {
    setRefreshing(true);
    fetchUsers().finally(() => setRefreshing(false));
  };

  // Chart data
  const pieData = {
    labels: users.map((u) => u.name),
    datasets: [
      {
        data: users.map((u) => u.totalFiles || 0),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FFCD56",
          "#8AFF33",
          "#33FFBD",
        ],
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-linear-65 from-green-700 to-cyan-800 text-white flex flex-col">
        <div className="p-6 font-bold text-2xl text-center">
          Excel Analytics
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li className="px-3 py-1 bg-white text-black rounded-4xl m-4 hover:bg-green-200 text-center cursor-pointer">
              Dashboard
            </li>
            <li className="px-3 py-1 bg-white text-black rounded-4xl m-4 hover:bg-green-200 text-center cursor-pointer">
              Account Settings
            </li>
          </ul>
        </nav>
        <div className="p-6 border-t border-gray-400">
          {/* <button className="w-full text-center bg-white text-black hover:bg-green-200 rounded-4xl py-2 cursor-pointer">
            Admin Access
          </button> */}
          <button
            onClick={() => {
              localStorage.removeItem("role");
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="w-full text-center bg-white text-black hover:bg-red-400 rounded-4xl py-2 mb-5 mt-5 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6 bg-green-100 p-4 rounded-lg shadow">
          <h1 className="text-xl font-semibold">Welcome back, Admin! 👋</h1>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-600 cursor-pointer"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* User Info + Chart */}
        <div className="grid grid-cols-3 gap-6">
          {/* User Info */}
          <div className="col-span-2 bg-green-100 rounded-xl p-4 shadow">
            <h2 className="font-semibold mb-4">USER INFO</h2>
            <div className="space-y-3">
              {users
                .filter((user) => user.email !== "chandankkumar156@gmail.com")
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-green-700" />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          Total files: {user.totalFiles || 0}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-4 text-center">
              User Uploads Pie Chart
            </h2>
            <Pie
              key={JSON.stringify(users)}
              data={pieData}
              options={{
                responsive: true,
                plugins: {
                  labels: {
                    position: "top",
                    labels: {
                      boxWidth: 20,
                      padding: 15,
                    },
                  },
                  title: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      {/* ✅ Toast Container inside AdminPanel */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminPanel;
