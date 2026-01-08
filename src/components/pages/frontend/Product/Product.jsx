import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaHeart,
  FaEye,
  FaShoppingCart,
  FaCheck,
} from "react-icons/fa";
import { getProduct } from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

const Product = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);
  const [addedItems, setAddedItems] = useState([]);

  const navigate = useNavigate();
  const { addItem } = useCart();

  // 🔹 Fetch products + categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productRes, categoryRes] = await Promise.all([
          getProduct(),
          getCategories(),
        ]);

        setProducts(productRes.data.data || []);

        // Add "All" manually
        setCategories([
          { id: "all", name: "All" },
          ...(categoryRes.data.data || []),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Add to cart
  const handleAddToCart = async (product, e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first 🙏");
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      alert("Product is out of stock!");
      return;
    }

    setAddingToCart(product.id);

    try {
      await addItem(product.id, 1);

      setAddedItems((prev) => [...prev, product.id]);
      setTimeout(() => {
        setAddedItems((prev) => prev.filter((id) => id !== product.id));
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  // 🔹 Favorite toggle
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 🔹 Filter products by category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) =>
            p.category?.name === selectedCategory ||
            p.category_id === selectedCategory
        );

  // 🔹 Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Our Products
          </h1>
          <p className="text-slate-600">
            Discover amazing deals on premium products
          </p>
        </div>

        {/* ===== CATEGORIES ===== */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-2.5 rounded-full font-semibold transition ${
                selectedCategory === cat.name
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "bg-white text-slate-700 border hover:bg-slate-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ===== PRODUCTS ===== */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white h-[380px] rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
              >
                {/* IMAGE */}
                <div className="relative bg-slate-100 h-[55%]">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/400x300?text=No+Image")
                    }
                  />

                  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                    <FaStar className="text-amber-400" />
                    <span className="text-sm font-semibold">
                      {product.rating || 5}.0
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 bg-pink-500 p-2 rounded-full"
                  >
                    <FaHeart
                      className={
                        favorites.includes(product.id)
                          ? "text-yellow-400"
                          : "text-white"
                      }
                    />
                  </button>

                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="absolute bottom-3 right-3 bg-blue-500 text-white p-2 rounded-full"
                  >
                    <FaEye />
                  </button>
                </div>

                {/* INFO */}
                <div className="p-5 h-[40%]">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      ${product.price}
                    </span>
                    <span className="line-through text-sm text-gray-500">
                      ${(product.price * 1.3).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={
                      addingToCart === product.id || product.stock === 0
                    }
                    className={`w-full py-3 rounded-xl text-white font-semibold flex justify-center items-center gap-2 ${
                      addedItems.includes(product.id)
                        ? "bg-green-600"
                        : "bg-blue-900"
                    }`}
                  >
                    {addingToCart === product.id
                      ? "Adding..."
                      : addedItems.includes(product.id)
                      ? (
                        <>
                          <FaCheck /> Added!
                        </>
                      )
                      : (
                        <>
                          <FaShoppingCart /> Add to Cart
                        </>
                      )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
