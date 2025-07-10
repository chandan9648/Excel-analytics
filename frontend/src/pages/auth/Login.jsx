import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate} from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
   const navigate = useNavigate();

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try{
    const res = await axios.post("http://localhost:5000/api/auth/login", data);
    login(res.data.token);
    localStorage.setItem("token", res.data.token);
      navigate("/dashboard");  
    } catch (err){
       console.error("Login failed:", err);
      alert("Invalid credentials");
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-green-100">

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg   shadow-lg w-90">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input name="email" placeholder="Email" onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border rounded focus:outline-none" required />

        <input type="password" name="password" placeholder="Password" onChange={handleChange}
          className="mb-6 w-full px-4 py-2 border rounded focus:outline-none" required />

        <button type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Login</button>

        <p className="mt-4 text-sm text-center">
          Don’t have an account? <Link to="/signup" className="text-blue-500">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
