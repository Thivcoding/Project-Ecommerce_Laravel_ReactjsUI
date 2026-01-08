import React, { useEffect, useState } from "react";
import { FaTimesCircle, FaPhone, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { getOrders, cancelOrder } from "../../services/orderService";
import { format } from "date-fns";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (date) => format(new Date(date), "MMM dd, yyyy HH:mm");

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "border-amber-400 text-amber-600";
      case "completed":
        return "border-emerald-400 text-emerald-600";
      case "canceled":
        return "border-rose-400 text-rose-600";
      default:
        return "border-gray-400 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "completed":
        return "✅";
      case "canceled":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const handleCancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrder(id);
      alert("Order canceled successfully!");
      fetchOrders();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order!");
    }
  };

  const mergeOrderItems = (items) => {
    const map = {};
    items.forEach((item) => {
      const productId = item.product?.id || item.product_name || item.id;
      if (!map[productId]) {
        map[productId] = { ...item, quantity: item.quantity };
      } else {
        map[productId].quantity += item.quantity;
      }
    });
    return Object.values(map);
  };

  // Search filter
  const filteredOrders = orders.filter(
    (o) =>
      o.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Totals
  const totalOrders = filteredOrders.length;
  const totalAmount = filteredOrders.reduce(
    (sum, o) => sum + Number(o.total_price || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        No orders found.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">Orders</h1>

        {/* ===== SEARCH & TOTALS ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          {/* Totals */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="p-10 py-3 rounded-2xl text-white border border-gray-500 hover:scale-105 transition-transform">
              <p className="text-sm text-black uppercase">Total Orders</p>
              <p className="text-2xl text-black font-bold mt-1">{totalOrders}</p>
            </div>
            <div className="p-8 py-3 rounded-2xl text-white border border-gray-500 hover:scale-105 transition-transform">
              <p className="text-sm text-black uppercase">Total Amount</p>
              <p className="text-2xl text-black font-bold mt-1">${totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by customer or order #..."
              className="w-full pl-12 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>


        {/* ===== TABLE ===== */}
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-lg text-slate-600">
              <tr>
                <th className="px-6 py-3 text-lg text-left">Order #</th>
                <th className="px-6 py-3 text-lg text-left">Customer</th>
                <th className="px-6 py-3 text-lg text-left">Phone</th>
                <th className="px-6 py-3 text-lg text-left">Address</th>
                <th className="px-6 py-3 text-lg text-left">Total Price</th>
                <th className="px-6 py-3 text-lg text-left">Status</th>
                <th className="px-6 py-3 text-lg text-center">View</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                >
                  <td className="px-6 text-lg py-4 font-semibold text-indigo-600">{order.order_number}</td>
                  <td className="px-6 text-lg py-4">{order.user?.name}</td>
                  <td className="px-6 text-lg py-4">{order.phone}</td>
                  <td className="px-6 text-lg py-4">{order.address}</td>
                  <td className="px-6 text-lg py-4 font-bold text-green-600">
                    ${parseFloat(order.total_price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-lg font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-white text-lg bg-indigo-600 p-2 px-6 rounded-xl">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== MODAL ===== */}
        {showModal && selectedOrder && (
          <OrderModal
            order={selectedOrder}
            close={() => setShowModal(false)}
            handleCancel={handleCancelOrder}
            mergeOrderItems={mergeOrderItems}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        )}
      </div>
    </div>
  );
};

// ===== MODAL COMPONENT =====
const OrderModal = ({ order, close, handleCancel, mergeOrderItems, formatDate, getStatusColor, getStatusIcon }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

      {/* Header */}
      <div className="bg-blue-900 p-6 text-white sticky top-0 flex justify-between items-start rounded-t-3xl">
        <div>
          <h2 className="text-2xl font-bold mb-2">Order Details</h2>
          <p className="text-sm opacity-90">Order #{order.id}</p>
        </div>
        <button onClick={close} className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all">
          <FaTimesCircle className="w-6 h-6 text-red-500" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Status & Date */}
        <div className="flex justify-between items-center">
          <div className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="text-sm font-semibold uppercase">{order.status}</span>
          </div>
          <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
        </div>

        {/* Contact */}
        <div className="bg-purple-50 rounded-2xl p-4 space-y-3">
          <h3 className="font-bold text-gray-800 mb-2">Contact Information</h3>
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full"><FaPhone className="text-purple-600" /></div>
            <div><p className="text-xs text-gray-500">Phone</p><p className="font-semibold text-gray-800">{order.phone}</p></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-pink-100 p-2 rounded-full"><FaMapMarkerAlt className="text-pink-600" /></div>
            <div><p className="text-xs text-gray-500">Delivery Address</p><p className="font-semibold text-gray-800">{order.address}</p></div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4">Order Items</h3>
          <div className="space-y-3">
            {mergeOrderItems(order.order_items).map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl items-center">
                <img src={item.product?.image_url || 'https://via.placeholder.com/80'} alt={item.product?.name || 'Product'} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{item.product?.name || 'Product'}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-purple-600 font-bold">
                    ${parseFloat(item.price).toFixed(2)} × {item.quantity} = ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
          <span className="text-3xl font-bold text-purple-600">${parseFloat(order.total_price).toFixed(2)}</span>
        </div>

        {order.status === 'pending' && (
          <button
            onClick={() => handleCancel(order.id)}
            className="w-full bg-red-100 text-red-600 py-3 rounded-xl hover:bg-red-200 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <MdCancel className="w-5 h-5" />
            Cancel Order
          </button>
        )}
      </div>
    </div>
  </div>
);

export default Orders;
