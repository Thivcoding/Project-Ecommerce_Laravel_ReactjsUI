import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaSave,
  FaArrowLeft,
  FaTags,
  FaAlignLeft,
} from "react-icons/fa";
import {
  getCategoryById,
  updateCategory,
} from "../../../services/categoryService";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [errors, setErrors] = useState({});
useEffect(() => {
  const fetchCategory = async () => {
    try {
      setPageLoading(true);
      const res = await getCategoryById(id);
      setForm({
        name: res.data.data.name,
        description: res.data.data.description || "",
      });
    } catch (error) {
      alert("Failed to load category");
    } finally {
      setPageLoading(false);
    }
  };
  fetchCategory();
}, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await updateCategory(id, form);
      navigate("/dashboard/categories");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        alert("Failed to update category");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading category...</p>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard/categories")}
            className="p-3 border rounded-lg hover:bg-slate-100"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              Edit Category #{id}
            </h1>
            <p className="text-sm text-slate-500">
              Update category information
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-8 space-y-6"
        >
          {/* NAME */}
          <div>
            <label className="text-sm font-medium flex gap-2 mb-2">
              <FaTags /> Category Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name[0]}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium flex gap-2 mb-2">
              <FaAlignLeft /> Description
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description[0]}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <FaSave />
              {loading ? "Updating..." : "Update Category"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/categories")}
              className="px-6 py-3 border rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
