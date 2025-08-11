import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import x from "../assets/x.png";

const Navbar = () => {
  const { user} = useContext(AuthContext);
  const location = useLocation();

  // Hide navbar on certain routes (optional)
  const hideOnRoutes = ["/dashboard", "/admin", "/upload"];
  const isHidden = hideOnRoutes.includes(location.pathname) && user;

  if (isHidden) return null;

  return (
    <nav className="flex items-center justify-between   bg-green-200 shadow">
      {/* Logo only when user is NOT logged in */}
      {!user && (
        <div className="text-2xl font-bold text-green-900 flex items-center gap-2">
          <img src={x} alt="Logo" className="w-12 h-8" />
          Excel Analytics
        </div>
      )}

      {/* Right side: Buttons */}
      <div className="flex items-center space-x-5 ml-auto ">
        {!user ? (
          <>
            <Link
              to="/login"
              className="text-lg hover:underline bg-linear-to-r/hsl from-indigo-500 to-blue-400 rounded-xl  px-4 py-2  text-white"
            >
              <b>Login</b>
            </Link>
            <Link
              to="/signup"
              className="text-lg hover:underline bg-linear-to-r/hsl from-indigo-500 to-blue-400 rounded-xl  px-4 py-2 text-white"
            >
              <b>Signup</b>
            </Link>
          </>
        ) : null} 
      </div>
    </nav>
  );
};

export default Navbar;
