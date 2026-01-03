import React, { useState, useEffect } from 'react';
import { profile } from '../../services/authService';
import axios from "axios";


const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [imageFile, setImageFile] = useState(null); // new image file
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profile();
      const user = res.data;
      
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '••••••••'
      });
      
      if (user.image_url) setImagePreview(user.image_url);
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

const handleSubmit = async () => {
  try {
    setLoading(true);
    setError(null);

    // Prepare FormData
    const data = new FormData();
    data.append('name', formData.name || '');
    data.append('email', formData.email || '');
    
    if (formData.password && formData.password !== '••••••••') {
      data.append('password', formData.password);
    }
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    // Debug: check FormData
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const res = await axios.post('http://127.0.0.1:8000/api/user', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Response:', res.data);

    const updatedUser = res.data.user;
    const newToken = res.data.token;

    // Save new token to localStorage
    if (newToken) {
      localStorage.setItem('token', newToken);
    }

    // Update UI with new data
    setFormData({
      name: updatedUser.name,
      email: updatedUser.email,
      password: '••••••••',
    });

    // Update image preview
    if (updatedUser.image_url) {
      setImagePreview(updatedUser.image_url);
    }

    // Success message
    alert(res.data.message || 'Profile updated successfully!');
    
    // Reset form state
    setIsEditing(false);
    setImageFile(null);

  } catch (err) {
    console.error('Update error:', err);

    // Handle different error types
    if (err.response?.status === 401) {
      setError('Session expired. Please login again.');
      localStorage.removeItem('token');
      // Redirect to login page
      // window.location.href = '/login';
    } else if (err.response?.data?.errors) {
      // Laravel validation errors
      const errors = err.response.data.errors;
      const firstError = Object.values(errors)[0][0];
      setError(firstError);
    } else if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError('Failed to update profile. Please try again.');
    }

  } finally {
    setLoading(false);
  }
};



  if (loading && !formData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {/* Camera icon for image upload */}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-indigo-600 p-2.5 rounded-full cursor-pointer hover:bg-indigo-700 transition shadow-lg text-white">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  {/* camera icon */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 px-8 pb-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{formData.name}</h1>
            <p className="text-gray-600">{formData.email}</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

          {/* Edit Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Edit Icon */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-indigo-500
                            disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={() => { setIsEditing(false); setImageFile(null); fetchProfile(); }}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
