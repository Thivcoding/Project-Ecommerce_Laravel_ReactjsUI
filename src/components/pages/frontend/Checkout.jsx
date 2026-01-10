import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../services/orderService";
import { getCart } from "../../services/cartService";
import { FaShoppingBag } from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", address: "" });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
      0
    );
  };

  const handleSubmit = async () => {
    if (!form.phone || !form.address) {
      setError("Please fill all fields");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await createOrder(form);
      if (res.data.success) {
        navigate(`/payment/${res.data.data.id}`);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: Checkout Form */}
        <div className="bg-white shadow-lg rounded-xl p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-blue-800 text-center">Checkout</h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your delivery address"
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating Order..." : "Place Order"}
          </button>
        </div>

        {/* RIGHT: Order Summary */}
       <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
  <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
    <FaShoppingBag /> Your Order
  </h2>

  {cartItems.length === 0 ? (
    <p className="text-gray-500">Your cart is empty.</p>
  ) : (
    <div className="space-y-4">
      {cartItems.map((item) => {
        const price = Number(item.product?.price) || 0;
        const total = price * (item.quantity || 0);

        return (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product?.image_url}
                alt={item.product?.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold">{item.product?.name}</p>
                <p className="text-gray-500 text-sm">
                  {item.quantity} x ${price.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="font-bold">${total.toFixed(2)}</p>
          </div>
        );
      })}

      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
        <span>Total:</span>
        <span>${calculateTotal().toFixed(2)}</span>
      </div>
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default Checkout;
