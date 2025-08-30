import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      toast.success(res.data.message || "Reset link sent ✅", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong ❌", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-500 to-green-500 px-4">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Forgot Password?</h1>
        <h3 className="text-sm mb-6 text-center">Enter your email to reset password</h3>

        <label>Email address</label>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5 w-full px-4 py-2 border rounded focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer"
        >
          Send Reset Link
        </button>

        <p className="mt-4 text-sm text-center">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-500 cursor-pointer">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
