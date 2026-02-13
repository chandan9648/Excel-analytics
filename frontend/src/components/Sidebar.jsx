import { NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaUpload,
  FaHistory,
  FaChartBar,
  FaSignOutAlt,
  FaComment,
  FaCog,
} from "react-icons/fa";


const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`${
          isOpen ? "fixed" : "hidden"
        } inset-0 bg-black/40 z-40 lg:hidden`}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 w-64 min-h-screen shadow-2xl border p-7 z-50 bg-linear-65 from-green-700 to-cyan-800
        transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="text-2xl font-bold mb-10">Excel analytics</div>
        <nav className="flex flex-col gap-4 text-gray-700">
          <NavLink
            to="/dashboard"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500 ${
                isActive ? "ring-2 ring-green-500" : ""
              }`
            }
          >
            <FaHome /> Dashboard
          </NavLink>

          <NavLink
            to="/upload"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500 ${
                isActive ? "ring-2 ring-green-500" : ""
              }`
            }
          >
            <FaUpload /> Upload Files
          </NavLink>
          <NavLink
            to="/dashboard/charts"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500 ${
                isActive ? "ring-2 ring-green-500" : ""
              }`
            }
          >
            <FaChartBar /> Visualization
          </NavLink>
          <NavLink
            to="/dashboard/history"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500 ${
                isActive ? "ring-2 ring-green-500" : ""
              }`
            }
          >
            <FaHistory /> File History
          </NavLink>
          <NavLink
            to="/dashboard/insight"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500 ${
                isActive ? "ring-2 ring-green-500" : ""
              }`
            }
          >
            <FaComment /> Smart Analysis
          </NavLink>

          <NavLink
            to="/account-settings"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500 ${
                isActive ? "ring-2 ring-green-500" : ""
              }`
            }
          >
            <FaCog /> Account Settings
          </NavLink>

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
