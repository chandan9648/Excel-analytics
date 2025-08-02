import { useEffect, useState,user} from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";


const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [loggedInCount, setLoggedInCount] = useState(0);
  const [history, setHistory] = useState([]);

  // Fetch both user stats in one call and log for debugging
  const fetchUserStats = async () => {
    try {
      const res = await API.get("/auth/user-stats");
      console.log("User stats response:", res.data);
      setUserCount(res.data.total);
      setLoggedInCount(res.data.loggedIn);
    } catch (err) {
      console.error("Failed to fetch user stats", err);
    }
  };

  const fetchUploadHistory = async () => {
    const res = await API.get("/upload/history");
    setHistory(res.data);
  };

  useEffect(() => {
      fetchUserStats();
      fetchUploadHistory();
      
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-10 w-screen bg-green-50 min-h-screen ">
        {/* <h2 className="text-3xl font-bold mb-6 text-green-800">📊 Dashboard</h2> */}
       <div className=" lg:mb-5 bg-white rounded p-5 shadow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || "User"}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your data analytics today.
              </p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-xl text-green-700">Total Users</h3>
            <p className="text-3xl">{userCount}</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-xl text-green-700">Logged In Users</h3>
            <p className="text-3xl">{loggedInCount}</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-xl text-green-700">Files Uploaded</h3>
            <p className="text-3xl">{history.length}</p>
          </div>
        </div>

        {/* Upload History */}
        <h3 className="text-xl text-green-700 mb-4">Recent Uploads</h3>
        <ul className="space-y-3">
          {history.map((item, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <p className="font-medium">{item.filename}</p>
              <p className="text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
