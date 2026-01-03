import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaArrowLeft } from "react-icons/fa";
import { getProductById } from "../../../services/productService";
import { useCart } from "../../../context/CartContext"; 

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartMessage("Please login to add items to cart");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (product.stock === 0) {
      setCartMessage("Product is out of stock!");
      setTimeout(() => setCartMessage(""), 3000);
      return;
    }

    setAddingToCart(true);

    try {
      await addItem(product.id, quantity); // ✅ Add to cart via context

      setCartMessage("✓ Added to cart successfully!");
      setTimeout(() => setCartMessage(""), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        setCartMessage("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setCartMessage("Failed to add to cart. Please try again.");
        setTimeout(() => setCartMessage(""), 3000);
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-20 h-20 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <h2 className="text-3xl font-bold text-slate-800">Product Not Found</h2>
    </div>
  );

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <Link
          to="/product"
          className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <FaArrowLeft /> Back to Products
        </Link>

        {/* Cart Message */}
        {cartMessage && (
          <div
            className={`mb-6 p-4 rounded-xl font-semibold text-center transition-all duration-300 ${
              cartMessage.includes("✓")
                ? "bg-green-100 text-green-700 border-2 border-green-300"
                : "bg-red-100 text-red-700 border-2 border-red-300"
            }`}
          >
            {cartMessage}
          </div>
        )}

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          
          {/* LEFT - IMAGE */}
          <div className="flex items-center justify-center">
            <div className="relative group w-full">
              <div className="rounded-2xl overflow-hidden bg-slate-50 shadow-lg">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-96 object-contain transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=No+Image"}
                />
              </div>
              <button className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md text-slate-600 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg">
                <FaHeart className="text-xl" />
              </button>
            </div>
          </div>

          {/* RIGHT - DETAIL */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              {product.name}
            </h1>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-indigo-600">${product.price}</span>
              </div>
            </div>

            <div className="mb-5 w-full flex justify-between items-center">
              <div
                className={`inline-flex items-center gap-2 px-5 py-2.5 mt-10 h-[50%] rounded-full font-semibold text-sm ${
                  product.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <span>{product.stock}</span>
                <span>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
              </div>

              <div className="mt-4 w-[60%]">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Quantity
                </label>
                <select
                  name="quantity"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={product.stock === 0}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-slate-700 font-medium disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed text-base">{product.description}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-2 cursor-pointer rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <FaShoppingCart className="text-xl" />
                <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="px-6 py-2 cursor-pointer rounded-xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-bold transition-all duration-300"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
