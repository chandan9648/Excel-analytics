import { useEffect, useState } from "react";
import API from "../../api";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const res = await API.get("/upload/history");
    setHistory(res.data);
  };

  const upload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await API.post("/upload/upload", formData);
    setFile(null);
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-10 bg-green-100">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload} className="ml-2 bg-green-600 text-white px-4 py-2">Upload</button>

      <div className="mt-6">
        <h3 className="text-xl">Upload History</h3>
        <ul className="mt-2 space-y-2">
          {history.map((item, i) => (
            <li key={i} className="bg-gray-100 p-2 rounded">
              {item.filename} - {new Date(item.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
