import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch, FaBolt, FaSignOutAlt, FaBox } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";

const MasterLayoutUser = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Cart Context
  const { cartCount, resetCart, fetchCart } = useCart();

  // Orders Context
  const { activeOrdersCount, fetchOrders } = useOrders();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check login and fetch cart/orders on page load or path change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetchCart();
      fetchOrders(); // refresh orders count
    }
  }, [location.pathname]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    resetCart();
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Highlight active menu
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* LOGO */}
            <Link to="/" className="flex items-center space-x-3 group">
              <FaBolt className="text-indigo-600 text-3xl" />
              <h1 className="text-2xl font-bold text-indigo-600">E-Shop</h1>
            </Link>

            {/* MENU */}
            <ul className="hidden lg:flex items-center space-x-2">
              {[{ name: "Home", path: "/" }, { name: "Products", path: "/product" }, { name: "About", path: "/about" }, { name: "Contact", path: "/contact" }].map((m) => (
                <li key={m.name}>
                  <Link
                    to={m.path}
                    className={`px-4 py-2 rounded-lg font-semibold ${isActive(m.path) ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-indigo-50"}`}
                  >
                    {m.name}
                  </Link>
                </li>
              ))}

              {isLoggedIn && (
                <li className="relative">
                  <Link
                    to="/orders"
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isActive("/orders") ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-indigo-50"}`}
                  >
                    <FaBox /> Orders
                  </Link>
                  {activeOrdersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeOrdersCount > 99 ? "99+" : activeOrdersCount}
                    </span>
                  )}
                </li>
              )}
            </ul>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
              {/* SEARCH */}
              <div className="hidden md:block relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-indigo-500"
                />
              </div>

              {/* AUTH */}
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="p-2 hover:bg-indigo-50 rounded">
                    <FaUser />
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Login</Link>
              )}

              {/* CART */}
              <Link to="/cart" className="relative p-2">
                <FaShoppingCart className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="min-h-screen">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12 mt-12 border-t-4 border-indigo-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaBolt className="text-indigo-500 text-2xl" />
                <h2 className="text-xl font-bold text-white">E-Shop</h2>
              </div>
              <p className="text-gray-400">Your one-stop shop for quality electronics and gadgets.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
                <li><Link to="/product" className="hover:text-indigo-400 transition-colors">Shop</Link></li>
                <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                {isLoggedIn && <li><Link to="/orders" className="hover:text-indigo-400 transition-colors">Orders</Link></li>}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@eshop.com</li>
                <li>📞 +1 234 567 890</li>
                <li>📍 123 Shopping St, NY</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 E-Shop Electronics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MasterLayoutUser;
