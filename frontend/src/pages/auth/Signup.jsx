import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../../components/Card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react"; // Optional icon set

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/signup", data);
      toast.success("Signup successful ✅", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error(err.response?.data?.msg || "Signup failed ❌", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Card>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <label className="">Full name</label>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border rounded focus:outline-none"
          required
        />

        <label className="">Email address</label>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border rounded focus:outline-none"
          required
        />

        <label className="">Password</label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded pr-10 focus:outline-none"
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
          Sign Up
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </Card>
  );
};

export default Signup;
