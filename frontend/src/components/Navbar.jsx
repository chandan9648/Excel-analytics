import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import x from "../assets/x.png";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between  py-2 px-4 bg-green-100 border-0 shadow ">
      <div className="text-2xl font-bold text-green-900 flex items-center gap-2">
        <img src={x} alt="Logo" className="w-12 h-8" />
        Excel Analytics
      </div>
      <div className="flex items-center space-x-5">
        <Link to="/home" className="text-sm hover:underline"></Link>
        {user && (
          <>
            {/* <Link to="/dashboard" className="text-sm ho ver:underline"><b>Dashboard</b></Link>
            <Link to="/admin" className="text-sm hover:underline"><b>Admin</b></Link>
            <Link to="/upload" className="text-sm hover:underline"></Link> */}
          </>
        )}
        {!user ? (
          <>
            <Link to="/login" className="text-lg hover:underline bg-green-500 rounded-xl p-2"><b>Login</b></Link>
            <Link to="/signup" className="text-lg hover:underline bg-green-500 rounded-xl p-2"><b>Signup</b></Link>
          </>
        ) : (
          <button
            className="text-sm hover:underline"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <b>Logout</b>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
