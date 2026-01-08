import React, { useState } from "react";
import { register } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (form.image) formData.append("image", form.image);

      const res = await register(formData);

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {/* Avatar Upload */}
        <div className="flex justify-center mb-6">
          <label className="relative cursor-pointer">
            <img
              src={preview || "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"}
              alt="Your avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
              Edit
            </span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
