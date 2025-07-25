import { useEffect, useState } from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

const HistoryPage = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/upload/mine");
      setUploads(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="flex">
    
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-8 w-full bg-green-50 min-h-screen">
        <h2 className="text-2xl font-semibold mb-6 text-green-600">Your Upload History</h2>

        {loading ? (
          <p>Loading...</p>
        ) : uploads.length === 0 ? (
          <p>No uploads yet.</p>
        ) : (
          <div className="grid gap-4">
            {uploads.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded shadow border">
                <p><strong>Filename:</strong> {item.filename}</p>
                <p><strong>Rows Parsed:</strong> {item.parsedData.length}</p>
                <p className="text-sm text-gray-500">
                  <strong>Uploaded on:</strong> {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
