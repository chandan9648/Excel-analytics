import { useState, useContext} from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate} from "react-router-dom";


const Login = ({setRole}) => {
  const { login } = useContext(AuthContext);
  const [data, setData] = useState({ email: "", password: "", role: "user" });
 
   const navigate = useNavigate();

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });
  
  
  const handleSubmit = async e => {
    e.preventDefault();
    try{
    const res = await axios.post("http://localhost:5000/api/auth/login", data);

     // Save to localStorage after successful login
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role); // save role
 
      login(res.data.token); 
      setRole(res.data.user.role); //  optional, for live updates

      // Redirect based on role (optional)
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err){
       console.error("Login failed:", err.response?.data || err.message);
      alert("Invalid credentials");
    }
  };
  

  return (
    <div className="min-h-screen flex min-w-screen items-center justify-center bg-green-200 fixed">

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg   shadow-lg w-90">
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome back!</h1>
        <h3 className="text-sm  mb-6 text-center "> login to continue</h3>
         
         {/*  Role Selector */}
                 {/* <label>Role as</label>
                 <select
                   name="role"
                   value={data.role}
                   onChange={handleChange}
                   className="mb-4 w-full px-4 py-2 border rounded focus:outline-none"
                 >
                   <option value="user">User</option>
                   <option value="admin">Admin</option>
                 </select> */}

        <label className="">Email address</label>
        <input name="email" placeholder="Email" onChange={handleChange}
          className="mb-5 w-full px-4 py-2 border rounded focus:outline-none" required />

        <label>Password</label>
        <input type="password" name="password" placeholder="Password" onChange={handleChange}
          className="mb-8 w-full px-4 py-2 border rounded focus:outline-none" required />

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
