import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getProductById, updateProduct } from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",  
    price: "",
    stock: "",
    category_id: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  // 🔹 Fetch categories and product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([getCategories(), getProductById(id)]);
        setCategories(catRes.data.data); // fetch categories
        const p = prodRes.data.data;

        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          stock: p.stock || "",
          category_id: p.category_id || "",
          image: null,
        });

        if (p.image_url) {
          setImagePreview(p.image_url);
        }
      } catch (err) {
        alert("Failed to load data");
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Image handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description || "");
      fd.append("price", form.price);
      fd.append("stock", form.stock);
      fd.append("category_id", form.category_id);

      if (form.image instanceof File) {
        fd.append("image", form.image);
      }

      await updateProduct(id, fd);
      navigate("/dashboard/products");
    } catch (err) {
      console.error(err.response?.data || err);
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        alert("Failed to update product. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
            onClick={() => navigate("/dashboard/products")}
            className="p-3 border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
            <p className="text-sm text-slate-500">Update product information</p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-slate-600 flex gap-2 mb-2">
                <FaBoxOpen /> Product Name
              </label>
              <input
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              placeholder="Product description"
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
                value={form.price}
                required
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 flex gap-2 mb-2">
                <FaWarehouse /> Stock
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                required
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
              />
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
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaSave /> {loading ? "Updating..." : "Update Product"}
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

export default EditProduct;
