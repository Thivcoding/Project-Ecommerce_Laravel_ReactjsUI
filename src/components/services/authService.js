import api from "../../api/axios";

// Login
export const login = (data) => api.post("/auth/login", data);

// Register
export const register = (data) =>
  api.post("/auth/register", data, {
    headers: {
      "Content-Type": "multipart/form-data", // important for image upload
    },
  });

// Get profile (requires JWT token in header)
export const profile = () => api.get("/user");

// Update profile (with optional password & image)
export const updateProfile = (data) =>

    api.put("/user", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });