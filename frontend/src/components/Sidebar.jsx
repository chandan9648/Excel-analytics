import { Link } from "react-router-dom";
import { FaHome, FaUpload, FaHistory, FaChartBar, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen shadow-2xl border- p-7 fixed bg-linear-65 from-green-700 to-cyan-800 ">
      <div className="text-2xl font-bold mb-10  ">Excel analytics</div>
      <nav className="flex flex-col gap-4 text-gray-700">
        <Link to="/dashboard" className="flex items-center gap-2 bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500">
          <FaHome /> Dashboard
        </Link>
        <Link to="/upload" className="flex items-center gap-2  bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500">
          <FaUpload /> Upload Files
        </Link>
         <Link to="/dashboard/charts" className="flex items-center gap-2  bg-green-50 rounded-2xl justify-center p-1   hover:text-green-500">
          <FaChartBar /> Charts Visuals
        </Link>
        <Link to="/dashboard/history" className="flex items-center gap-2  bg-green-50 rounded-2xl justify-center p-1 hover:text-green-500">
          <FaHistory /> File History
        </Link>
       
        <Link to="/logout" onClick={() => {
          localStorage.removeItem("role");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }} className="flex items-center gap-2 hover:text-red-500  bg-green-50 rounded-2xl justify-center p-1 mt-80">
          <FaSignOutAlt /> Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
