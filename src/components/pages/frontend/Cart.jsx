import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../../context/CartContext"; 

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, addItem, removeItem, clearAll, updateItem } = useCart();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Simulate fetch delay
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    setUpdating(true);
    try {
      await updateItem(itemId, newQty);
      showMessage("Cart updated successfully", "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to update cart", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setUpdating(true);
    try {
      await removeItem(productId);
      showMessage("Item removed from cart", "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to remove item", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    setUpdating(true);
    try {
      await clearAll();
      showMessage("Cart cleared successfully", "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to clear cart", "error");
    } finally {
      setUpdating(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(""), 3000);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1; // 10% tax
    return subtotal + tax;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/product"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaArrowLeft />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="text-4xl font-bold text-slate-900">Shopping Cart</h1>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={updating}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-slate-400"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Message Notification */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl font-semibold text-center transition-all duration-300 ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border-2 border-green-300"
                : "bg-red-100 text-red-700 border-2 border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <FaShoppingCart className="text-8xl text-slate-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Your cart is empty</h2>
            <p className="text-slate-600 mb-8">Add some products to get started!</p>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Cart Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex gap-6 flex-wrap">
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image_url || "/placeholder-image.jpg"}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {item.product.name}
                        </h3>
                        <p className="text-2xl font-bold text-indigo-600">
                          ${item.product.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={updating || item.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-lg transition-all duration-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
                          >
                            <FaMinus className="text-slate-700" />
                          </button>
                          <span className="text-xl font-bold text-slate-900 w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={updating || item.quantity >= item.product.stock}
                            className="w-10 h-10 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-lg transition-all duration-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
                          >
                            <FaPlus className="text-slate-700" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          disabled={updating}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 font-semibold disabled:text-slate-400"
                        >
                          <FaTrash />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-semibold">Item Subtotal:</span>
                    <span className="text-2xl font-bold text-slate-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-slate-900">Total</span>
                    <span className="text-3xl font-bold text-indigo-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6 p-4 bg-green-600 border-2 border-green-200 rounded-xl">
                  <p className="text-sm text-white font-bold text-center">
                    🎉 Free shipping on all orders!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
