import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8">
        
        {/* Left Side: Image */}
        <div className="flex justify-center">
          <img
            src="https://plus.unsplash.com/premium_photo-1720091339077-d0f56397a0c9?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Excel Analytics"
            className="w-full max-w-md md:max-w-150 h-100 rounded shadow-lg"
          />
        </div>

        {/* Right Side: Welcome content */}
        <div className="bg-white p-18 w-100 ml-20 rounded shadow text-center">
          <h1 className="text-4xl font-bold mb-5 text-green-700">Excel Analytics</h1>
          
          {user ? (
            <>
              <p className="text-lg mb-6">
                Logged in as: <strong>{user.email || user.id}</strong>
              </p>
              <button
                onClick={logout}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <p className="text-lg">You are not logged in.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
