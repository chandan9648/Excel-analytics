import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../../components/Card";
 
const Signup = () => {
  const [data, setData] = useState({

     name: "...",
     email: "...",
     password: "...",
     role: "user"
    });
    const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    try{
         await axios.post("http://localhost:5000/api/auth/signup", data);
         navigate("/login");
        } catch (err) {
          console.log("Sending data:", data);

           console.error("Signup failed:", err);
           setError(err.response?.data?.msg || "Signup failed. Try again.");
        }
  };

  return (
  <Card>
    {/* <div className="flex min-h-screen items-center justify-center bg-gray-100"> */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-90">
        <h2 className="text-2xl font-bold mb-6 text-center">SignUp</h2>

        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        
        <label className="">Full name</label>
        <input name="name" placeholder="Name" onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border-1 rounded focus:outline-none" required />

        <label className="">Email address</label>
        <input name="email" placeholder="Email" onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border-1 rounded focus:outline-none" required />

        <label className="">Password</label>
        <input type="password" name="password" placeholder="Password" onChange={handleChange}
          className="mb-6 w-full px-4 py-2 border rounded-1 focus:outline-none" required />

        <button type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Sign Up</button>

        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    {/* </div> */}
  </Card>
  );
};

export default Signup;
