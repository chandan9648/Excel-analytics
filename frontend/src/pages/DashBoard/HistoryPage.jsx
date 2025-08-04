import { useEffect, useState } from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import { Search } from "lucide-react";

const HistoryPage = () => {
  const [uploads, setUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/upload/mine");
      setUploads(res.data);
      setFilteredUploads(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredUploads(
      uploads.filter((file) => file.filename.toLowerCase().includes(value))
    );
  };

  return (
    <div className="flex">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 w-full bg-green-50 min-h-screen px-8 py-10">
        {/* File History Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-4">File History</h2>

          {/* Search Input */}
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search files by name..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <Search className="absolute right-3 top-2.5 text-green-500 w-5 h-5" />
            </div>
          </div>

          {/* Upload Cards */}
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredUploads.length === 0 ? (
            <p className="text-center text-gray-500">No Files Found. Upload a file to see its history!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUploads.map((item, i) => (
                <div key={i} className="bg-green-100 border border-green-300 rounded p-4 shadow">
                  <p className="font-semibold text-green-800">📄 {item.filename}</p>
                  <p className="text-sm text-gray-700">
                    Rows Parsed: {item.parsedData?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploaded on: {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Data Visualization Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-4">File Data Visualization</h2>
          <div className="h-64 flex items-center justify-center border rounded border-dashed border-gray-300">
            {/* This is a placeholder – replace with actual chart later */}
            <p className="text-gray-400">[ Chart Placeholder ]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
