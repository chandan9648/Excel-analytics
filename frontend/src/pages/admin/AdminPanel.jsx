import { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      const res = await API.get("/upload/all"); // Admin-protected route
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        Admin Panel - All User Uploads
      </h2>

      {loading ? (
        <p>Loading data...</p>
      ) : data.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {data.map((item, i) => (
            <div
              key={i}
              className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
            >
              <p>
                <strong>User:</strong> {item.user?.email || "N/A"}
              </p>
              <p>
                <strong>Filename:</strong> {item.filename}
              </p>
              <p>
                <strong>Uploaded:</strong>{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Rows:</strong> {item.parsedData?.length || 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
