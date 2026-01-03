import React, { useState, useEffect } from "react";
import { FaShoppingBag,FaBolt, FaMapMarkerAlt, FaPhone, FaCreditCard, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { getCart, clearCart } from "../../services/cartService";
import { createOrder } from "../../services/orderService";
import { useOrders } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const { addOrder } = useOrders(); 
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ phone: "", address: "" });
  const [errors, setErrors] = useState({});

  // Fetch cart items on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      if (response.data.success) {
        setCartItems(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setErrors({ fetch: "Failed to load cart items" });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return sum + price * quantity;
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone || formData.phone.length < 8) newErrors.phone = "Phone number must be at least 8 characters";
    if (!formData.address || formData.address.length < 5) newErrors.address = "Address must be at least 5 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      setErrors({ submit: "Your cart is empty" });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const response = await createOrder(formData);

      if (response.data.success) {
        const newOrder = response.data.data;
        addOrder(newOrder); // Add to context immediately
        setSuccess(true);

        // Clear cart after placing order
        await clearCart();
        setCartItems([]);

        // Redirect to /orders after 2 seconds
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        setErrors({ submit: response.data.message || "Failed to create order" });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Network error. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AiOutlineLoading3Quarters className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <div className="relative">
            <FaCheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6 animate-bounce" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-green-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 text-lg mb-6">Thank you for your purchase. We'll process your order shortly.</p>
          <div className="animate-pulse text-purple-600 font-semibold">Redirecting to orders...</div>
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <FaExclamationCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{errors.fetch}</p>
          <button
            onClick={fetchCart}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-all font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
          <FaShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 text-lg mb-6">Add some products to your cart before checking out.</p>
          <button
            onClick={() => (window.location.href = "/product")}
            className=" text-white px-8 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 text-lg">Complete your order in just a few steps</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact & Delivery Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-lg bg-opacity-95 space-y-6">

              {/* Phone */}
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaPhone className="text-purple-600" /> Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.phone ? "border-red-500" : "border-gray-200"
                    } focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none pl-10`}
                    placeholder="Enter your phone number"
                  />
                  <FaPhone className="absolute left-3 top-3.5 text-purple-500" />
                </div>
                {errors.phone && <p className="text-red-500 text-xl mt-2">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-pink-600" /> Full Address *
                </label>
                <div className="relative">
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.address ? "border-red-500" : "border-gray-200"
                    } focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all outline-none resize-none pl-10`}
                    placeholder="Enter your complete delivery address"
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-pink-500" />
                </div>
                {errors.address && <p className="text-red-500 text-xl mt-2">{errors.address}</p>}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <FaExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting || cartItems.length === 0}
                className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-950 transform hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="w-5 h-5" />
                    <span>Place Order</span>
                    <FaBolt className="w-5 h-5 text-yellow-300 animate-pulse" /> {/* extra cool icon */}
                  </>
                )}
              </button>
            </div>
          </div>


          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100">
                    <img
                      src={item.product?.image_url || "https://via.placeholder.com/80"}
                      alt={item.product?.name || "Product"}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                        {item.product?.name || "Product"}
                      </h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-purple-600 font-bold mt-1">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3 flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-purple-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-600 border-2 border-green-200  rounded-xl p-4 text-center">
                <p className="text-sm text-white font-bold">🎉 Free shipping on all orders!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
