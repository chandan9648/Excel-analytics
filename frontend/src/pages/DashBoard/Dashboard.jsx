import { useEffect, useState, useContext } from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [totalUploads, setTotalUploads] = useState(0);
  const [successUploads, setSuccessUploads] = useState(0);
  const [failedUploads, setFailedUploads] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUploadHistory = async () => {
    try {
      setLoading(true);
      // setHistory([]);
      setTotalUploads(0);
      setSuccessUploads(0);
      setFailedUploads(0);

      const res = await API.get("/upload/history");
      const data = res.data || [];

      const success = data.filter((item) => item.status === "success").length;
      const failed = data.filter((item) => item.status === "fail").length;

      setHistory(data);
      setTotalUploads(data.length);
      setSuccessUploads(success);
      setFailedUploads(failed);
    } catch (err) {
      console.error("Failed to fetch upload history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/upload/${id}`);
      fetchUploadHistory(); // Refresh after delete
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  const handleDownload = (filename, data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename.replace(/\.[^/.]+$/, "")}.json`;
    link.click();
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-10 w-screen bg-green-50 min-h-screen">
        <div className="lg:mb-5 bg-white rounded p-5 shadow flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || "User"}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your data analytics today.
            </p>
          </div>
          <button
            onClick={fetchUploadHistory}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow cursor-pointer"
          >
            {loading ? "Refreshing..." : "⟳ Refresh"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-200 p-6 shadow rounded">
            <h3 className="text-xl text-green-700">Total Files Uploaded</h3>
            <p className="text-3xl">{totalUploads}</p>
          </div>
          <div className="bg-green-100 p-6 shadow rounded">
            <h3 className="text-xl text-green-700">Successful Uploads</h3>
            <p className="text-3xl">{successUploads}</p>
          </div>
          <div className="bg-red-100 p-6 shadow rounded">
            <h3 className="text-xl text-green-700">Failed Uploads</h3>
            <p className="text-3xl">{failedUploads}</p>
          </div>
        </div>

        {/* Upload History */}
        <h3 className="text-xl text-green-700 mb-4">Recent Uploads</h3>
        {history.length === 0 ? (
          <p className="text-gray-500">No uploads found.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((item, i) => (
              <li
                key={i}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.filename}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleString()} •{" "}
                    <span
                      className={
                        item.status === "success"
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {item.status}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(item.filename, item.parsedData)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Download
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
