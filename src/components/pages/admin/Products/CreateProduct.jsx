import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaSave,
  FaArrowLeft,
  FaDollarSign,
  FaWarehouse,
  FaImage,
  FaTimes,
  FaAlignLeft,
} from "react-icons/fa";
import { createProduct } from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    stock: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // store validation errors

  // 🔹 Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data); // assuming API returns { data: [...] }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Only allow images
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file");
    return;
  }

  setForm({ ...form, image: file });
  setImagePreview(URL.createObjectURL(file));
};


  const removeImage = () => {
    setForm({ ...form, image: null });
    setImagePreview(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({}); // reset previous errors

  try {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description || "");
    fd.append("category_id", form.category_id);
    fd.append("price", form.price);
    fd.append("stock", form.stock);

    // Append real File object
    if (form.image instanceof File) {
      fd.append("image", form.image);
    }

    await createProduct(fd);
    navigate("/dashboard/products");
  } catch (err) {
    console.error(err.response?.data || err);
    if (err.response?.status === 422) {
      setErrors(err.response.data.errors || {});
    } else {
      alert("Failed to create product. Check console for details.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard/products")}
            className="p-3 border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add Product</h1>
            <p className="text-sm text-slate-500">Create a new product</p>
          </div>
        </div>

        {/* FORM */}
        <form  onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-8 space-y-6" >

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-slate-600 flex gap-2 mb-2">
              <FaBoxOpen /> Product Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Product name"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium text-slate-600 flex gap-2 mb-2">
              <FaBoxOpen /> Category
            </label>
            <select
              required
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">-- Select category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id[0]}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-slate-600 flex gap-2 mb-2">
              <FaAlignLeft /> Description
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Product description (optional)"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>}
          </div>

          {/* PRICE & STOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-600 flex gap-2 mb-2">
                <FaDollarSign /> Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 flex gap-2 mb-2">
                <FaWarehouse /> Stock
              </label>
              <input
                type="number"
                min="0"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock[0]}</p>}
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm font-medium text-slate-600 flex gap-2 mb-2">
              <FaImage /> Product Image
            </label>

            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50">
                <FaImage className="text-3xl text-slate-400 mb-3" />
                <p className="text-sm text-slate-500">Click to upload image</p>
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative">
                <img src={imagePreview} className="w-full h-56 object-contain bg-slate-100 rounded-xl border" />
                <button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-rose-500 text-white p-2 rounded-full hover:scale-110">
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaSave />
              {loading ? "Saving..." : "Save Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/products")}
              className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
