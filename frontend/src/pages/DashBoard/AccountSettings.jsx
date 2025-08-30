import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBars } from "react-icons/fa";

const AccountSettings = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/user/me");
        setForm((f) => ({ ...f, name: res.data?.name || "", email: res.data?.email || "" }));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    try {
      setLoading(true);
      const body = { name: form.name, email: form.email };
      if (form.password) body.password = form.password;
      await API.put("/user", body);
      toast.success("Settings saved ✅");
      setForm((f) => ({ ...f, password: "" }));
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
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
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-green-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 w-full p-4 sm:p-6 lg:p-8">
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <button aria-label="Open Menu" onClick={() => setSidebarOpen(true)} className="p-2 border rounded">
            <FaBars />
          </button>
          <span className="font-semibold">Settings</span>
        </div>
        <ToastContainer />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Account Settings</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl">👤</div>
              <div className="text-gray-600">Update your profile information.</div>
            </div>

            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input name="name" value={form.name} onChange={onChange} className="w-full border rounded p-2 mb-4" />

            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={onChange} className="w-full border rounded p-2 mb-4" />

            <label className="block text-sm text-gray-700 mb-1">New Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} className="w-full border rounded p-2 mb-6" placeholder="Enter new password" />

            <button onClick={onSave} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-60">{loading ? "Saving..." : "Save Changes"}</button>

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-3">If you delete your account, you will permanently lose access to your data.</p>
              <button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Delete Account</button>
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
      </div>
    </div>
  );
};

export default AccountSettings;
