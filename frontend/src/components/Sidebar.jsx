import { Link } from "react-router-dom";
import { FaHome, FaUpload, FaHistory, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-green-200 shadow-md border- p-7 fixed">
      <div className="text-2xl font-bold mb-10 text-green-600">Excel analytics</div>
      <nav className="flex flex-col gap-4 text-gray-700">
        <Link to="/dashboard" className="flex items-center gap-2 hover:text-green-500">
          <FaHome /> Dashboard
        </Link>
        <Link to="/upload" className="flex items-center gap-2 hover:text-green-500">
          <FaUpload /> Upload File
        </Link>
        <Link to="/dashboard/history" className="flex items-center gap-2 hover:text-green-500">
          <FaHistory /> History
        </Link>
        <Link to="/dashboard/charts" className="flex items-center gap-2 hover:text-green-500">
          <FaChartBar /> Charts
        </Link>

      </nav>
    </div>
  );
};

export default Sidebar;
