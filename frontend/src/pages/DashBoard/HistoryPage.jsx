import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import { Search, Eye, Trash2, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBars } from "react-icons/fa";

const HistoryPage = () => {
  // const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewRows, setPreviewRows] = useState([]);
  const [previewFilename, setPreviewFilename] = useState("");

  // Fetch upload history from backend
  const fetchHistory = async () => {
    try {
      const res = await API.get("/upload/history");
      setUploads(res.data);
      setFilteredUploads(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    // Accessibility for modal
    try { Modal.setAppElement('#root'); } catch (err) {
      console.log(err) /* noop for SSR/tests */ }
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setSearchTerm(value);

    const filtered = uploads.filter((file) => {
      const originalName = file.filename || "";
      return originalName.toLowerCase().includes(value);
    });

    setFilteredUploads(filtered);
  };

  const handleView = (item) => {
    setPreviewRows(Array.isArray(item.parsedData) ? item.parsedData : []);
    setPreviewFilename(item.filename || "Preview");
    setIsPreviewOpen(true);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this upload?");
    if (!ok) return;
    try {
      await API.delete(`/upload/${id}`);
      toast.success("File deleted successfully", { position: "top-right", autoClose: 2500 });
      await fetchHistory();
    } catch (e) {
      console.error("Delete failed", e);
      toast.error("Failed to delete file", { position: "top-right", autoClose: 3000 });
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64 w-full bg-green-50 min-h-screen px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <button aria-label="Open Menu" onClick={() => setSidebarOpen(true)} className="p-2 border rounded">
            <FaBars />
          </button>
          <span className="font-semibold">History</span>
        </div>
        <ToastContainer />
        {/* File History Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-4">File History</h2>

          {/* Search Input */}
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-xl">
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-50 text-green-800">
                  <th className="text-left px-4 py-3">File Name</th>
                  <th className="text-left px-4 py-3">Rows</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Uploaded At</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-4" colSpan={5}>Loading...</td></tr>
                ) : filteredUploads.length === 0 ? (
                  <tr><td className="px-4 py-4" colSpan={5}>No Files Found. Upload a file to see its history!</td></tr>
                ) : (
                  filteredUploads.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-4 py-3 text-gray-900 font-medium">{item.filename}</td>
                      <td className="px-4 py-3">{item.parsedData?.length || 0}</td>
                      <td className="px-4 py-3">
                        {item.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4"/> Success</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600"><XCircle className="w-4 h-4"/> Fail</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{new Date(item.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleView(item)} className="text-blue-600 hover:text-blue-800 cursor-pointer" title="Preview">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 cursor-pointer" title="Delete">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* File Data Visualization */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
            File Data Visualization
          </h2>
          <div className="h-64 flex items-center justify-center border rounded border-dashed border-gray-300">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredUploads.map((f) => ({ name: f.filename, rows: f.parsedData?.length || 0 }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-35} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="rows" fill="#22c55e" name="Number of Rows" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Preview Modal */}
        <Modal
          isOpen={isPreviewOpen}
          onRequestClose={() => setIsPreviewOpen(false)}
          contentLabel="Data Preview"
          style={{
            content: { maxWidth: '90%', inset: '10% 5% auto', maxHeight: '80%', overflow: 'auto' }
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{previewFilename} — Preview</h3>
            <button onClick={() => setIsPreviewOpen(false)} className="text-red-500">Close</button>
          </div>
          {previewRows.length === 0 ? (
            <p className="text-gray-600">No data available.</p>
          ) : (
            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    {Object.keys(previewRows[0]).map((col) => (
                      <th key={col} className="px-3 py-2 text-left border-b">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.slice(0, 50).map((row, idx) => (
                    <tr key={idx} className="border-b">
                      {Object.values(row).map((cell, i) => (
                        <td key={i} className="px-3 py-1 border-b">{String(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewRows.length > 50 && (
                <div className="text-xs text-gray-500 p-2">Showing first 50 rows…</div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default HistoryPage;
