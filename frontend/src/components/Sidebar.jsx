import { Link } from "react-router-dom";
import { FaHome, FaUpload, FaHistory, FaChartBar, FaSignOutAlt, FaComment, FaCog } from "react-icons/fa";

// Responsive Sidebar: slide-in on mobile; unchanged styling/colors
const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`${isOpen ? "fixed" : "hidden"} inset-0 bg-black/40 z-40 lg:hidden`}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 w-64 min-h-screen shadow-2xl border- p-7 z-50 bg-linear-65 from-green-700 to-cyan-800
        transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="text-2xl font-bold mb-10">Excel analytics</div>
        <nav className="flex flex-col gap-4 text-gray-700">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2 bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500">
            <FaHome /> Dashboard
          </Link>
          <Link to="/upload" onClick={onClose} className="flex items-center gap-2  bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500">
            <FaUpload /> Upload Files
          </Link>
          <Link to="/dashboard/charts" onClick={onClose} className="flex items-center gap-2  bg-green-50 rounded-2xl justify-center p-1   hover:text-green-500">
            <FaChartBar />Visualization
          </Link>
          <Link to="/dashboard/history" onClick={onClose} className="flex items-center gap-2  bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500">
            <FaHistory /> File History
          </Link>
          <Link to="/dashboard/insight" onClick={onClose} className="flex items-center gap-2  bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500">
            <FaComment /> Smart Analysis
          </Link>

          <Link to="/account-settings" onClick={onClose} className="flex items-center gap-2  bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500">
            <FaCog /> Account Settings
          </Link>

          <Link
            to="/logout"
            onClick={() => {
              localStorage.removeItem("role");
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 hover:text-red-500  bg-green-50 rounded-2xl justify-center p-1 mt-60"
          >
            <FaSignOutAlt /> Logout
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
