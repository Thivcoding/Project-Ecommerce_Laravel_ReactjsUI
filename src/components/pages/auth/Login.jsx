import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      const user = res.data.user;
      setUser(res.data.user); 
      if(user.role  !== "admin"){
          navigate("/"); 
        }else{
          navigate("/dashboard"); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-4 py-2 border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 rounded-lg font-semibold transition
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
