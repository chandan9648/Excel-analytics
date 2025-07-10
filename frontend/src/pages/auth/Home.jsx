import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-10 rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome 🎉</h1>
        <p className="text-lg mb-6">Logged in as: <strong>{user?.id}</strong></p>
        <button onClick={logout}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </div>
    </div>
  );
};

export default Home;
