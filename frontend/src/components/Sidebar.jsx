import { Link } from "react-router-dom";
import { FaHome, FaUpload, FaHistory, FaChartBar, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-green-300 shadow-2xl border- p-7 fixed">
      <div className="text-2xl font-bold mb-10 text-green-500 ">Excel analytics</div>
      <nav className="flex flex-col gap-4 text-gray-700">
        <Link to="/dashboard" className="flex items-center gap-2 hover:text-green-500">
          <FaHome /> Dashboard
        </Link>
        <Link to="/upload" className="flex items-center gap-2 hover:text-green-500">
          <FaUpload /> Upload Files
        </Link>
        <Link to="/dashboard/history" className="flex items-center gap-2 hover:text-green-500">
          <FaHistory /> File History
        </Link>
        <Link to="/dashboard/charts" className="flex items-center gap-2 hover:text-green-500">
          <FaChartBar /> Charts
        </Link>
        <Link to="/logout" onClick={() => {
          localStorage.removeItem("role");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }} className="flex items-center gap-2 hover:text-red-500 ">
          <FaSignOutAlt /> Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
