import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaUser, FaTrash, FaBars } from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../api";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState("dashboard"); // 'dashboard' | 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Settings form state
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Load admin profile when switching to settings
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/user/me");
        setForm({ name: res.data?.name || "", email: res.data?.email || "", password: "" });
      } catch (e) {
        console.error("Profile load failed", e);
      }
    };
    if (active === "settings") loadProfile();
  }, [active]);

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
      {/* Mobile overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`${sidebarOpen ? "fixed" : "hidden"} inset-0 bg-black/40 z-40 lg:hidden`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-screen bg-linear-65 from-green-700 to-cyan-800 text-white flex flex-col z-50
        transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0`}
      >
        <div className="p-6 font-bold text-2xl text-center">
          Excel Analytics
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li
              onClick={() => { setActive("dashboard"); setSidebarOpen(false); }}
              className={`px-3 py-1 bg-white text-black rounded-4xl m-4 text-center cursor-pointer hover:bg-green-200 ${active === "dashboard" ? "ring-2 ring-green-400" : ""}`}
            >
              Dashboard
            </li>
            <li
              onClick={() => { setActive("settings"); setSidebarOpen(false); }}
              className={`px-3 py-1 bg-white text-black rounded-4xl m-4 text-center cursor-pointer hover:bg-green-200 ${active === "settings" ? "ring-2 ring-green-400" : ""}`}
            >
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
            className={`w-full text-center bg-white text-black  rounded-4xl py-2 mb-5 mt-5 cursor-pointer hover:bg-red-500 ${active === 'logout' ? 'ring-2 ring-red-200' : ''}`}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <button
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="p-2 border rounded"
          >
            <FaBars />
          </button>
          <span className="font-semibold">Admin</span>
        </div>
        {active === "dashboard" ? (
          <>
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
                        <div className="flex items-center space-x-3 min-w-0">
                          <FaUser className="text-green-700 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{user.name}</p>
                            <p className="text-sm text-gray-600 truncate">{user.email}</p>
                            <p className="text-xs text-gray-500">
                              Total files: {user.totalFiles || 0}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer flex-shrink-0"
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
          </>
        ) : (
          // Account Settings view (keeps same Admin sidebar)
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4">Account Settings</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl">👤</div>
                <div className="text-gray-600">Update your profile information.</div>
              </div>

              <label className="block text-sm text-gray-700 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                className="w-full border rounded p-2 mb-4"
              />

              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                className="w-full border rounded p-2 mb-4"
              />

              <label className="block text-sm text-gray-700 mb-1">New Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                className="w-full border rounded p-2 mb-6"
                placeholder="Enter new password"
              />

              <button
                onClick={async () => {
                  try {
                    setSaving(true);
                    const body = { name: form.name, email: form.email };
                    if (form.password) body.password = form.password;
                    await API.put("/user", body);
                    toast.success("Settings saved ✅");
                    setForm((f) => ({ ...f, password: "" }));
                  } catch (e) {
                    toast.error(e.response?.data?.message || "Failed to save");
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700  text-white px-4 py-2 rounded cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-red-600 mb-2 ">Danger Zone</h3>
                <p className="text-sm text-gray-600 mb-3">If you delete your account, you will permanently lose access to your data.</p>
                <button
                  onClick={async () => {
                    if (!confirm("Delete your account? This cannot be undone.")) return;
                    try {
                      await API.delete("/user");
                      toast.success("Account deleted");
                      setTimeout(() => {
                        sessionStorage.clear();
                        window.location.href = "/login";
                      }, 1000);
                    } catch (e) {
                      toast.error(e.response?.data?.message || "Delete failed");
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded"
                >
                  Delete Account
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Security Tips</h3>
              <ul className="list-disc text-sm text-gray-600 pl-5 space-y-2">
                <li>Use a strong, unique password with a mix of letters, numbers, and symbols.</li>
                <li>Regularly update your password to keep your account secure.</li>
                <li>Enable two-factor authentication (2FA) if available for added security.</li>
                <li>Be cautious of phishing attempts and suspicious emails.</li>
              </ul>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold mb-2">Notifications</h4>
                <p className="text-sm text-gray-600">You will receive important email updates about account changes and security alerts. Ensure your email is up-to-date.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* ✅ Toast Container inside AdminPanel */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminPanel;
