import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react"; // Optional: Install lucide-react for icons

const Login = ({ setRole }) => {
  const { login } = useContext(AuthContext);
  const [data, setData] = useState({ email: "", password: "", role: "user" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      login(res.data.token);
      setRole(res.data.user.role);

      toast.success("Login successful ✅", {
        position: "top-right",
        autoClose: 3000,
      });

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      toast.error("Invalid credentials ❌", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex min-w-screen items-center justify-center fixed bg-gradient-to-tr from-purple-500 to-green-500">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-90"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome back!</h1>
        <h3 className="text-sm mb-6 text-center">Login to continue</h3>

        <label>Email address</label>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="mb-5 w-full px-4 py-2 border rounded focus:outline-none"
          required
        />

        <label>Password</label>
        <div className="relative mb-8">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 cursor-pointer">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
