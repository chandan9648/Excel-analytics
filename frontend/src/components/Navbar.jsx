import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import x from "../assets/x.png";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Hide navbar on certain routes (optional)
  const hideOnRoutes = ["/dashboard", "/admin", "/upload"];
  const isHidden = hideOnRoutes.includes(location.pathname) && user;

  if (isHidden) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm ring-1 ring-black/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo only when user is NOT logged in */}
        {!user && (
          <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
            <img src={x} alt="Excel Analytics Logo" className="w-10 h-7" />
            Excel Analytics
          </div>
        )}

        {/* Right side: Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {!user ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-500 shadow-sm hover:shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-500 shadow-sm hover:shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
              >
                Signup
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
