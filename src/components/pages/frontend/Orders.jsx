import React, { useState, useEffect } from "react";
import { FaShoppingBag, FaMapMarkerAlt, FaPhone, FaEye, FaTimesCircle, FaCheckCircle, FaClock, FaBox } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { useOrders } from "../../context/OrderContext";

const Orders = () => {
  const { orders, loading: ordersLoading, fetchOrders, cancelOrderById } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [error, setError] = useState(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders().catch(err => {
      console.error("Failed to fetch orders", err);
      setError("Failed to load orders");
    });
  }, []);

 useEffect(() => {
    if (!selectedOrder) return;

    const updatedOrder = orders.find(
      o => o.id === selectedOrder.id
    );

    if (updatedOrder) {
      setSelectedOrder(updatedOrder);
    }
  }, [orders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

const handleCancelOrder = async (orderId) => {
  if (!window.confirm("Are you sure you want to cancel this order?")) return;

  setCancelling(orderId);

  try {
    await cancelOrderById(orderId);
  } catch (err) {
    console.error(err);
    alert("Failed to cancel order");
  } finally {
    setCancelling(null);
  }
};


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FaClock className="w-4 h-4" />;
      case "completed":
        return <FaCheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <FaTimesCircle className="w-4 h-4" />;
      default:
        return <FaBox className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <AiOutlineLoading3Quarters className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <FaTimesCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchOrders().catch(() => setError("Failed to load orders"))}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
          <FaShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">No Orders Yet</h2>
          <p className="text-gray-600 text-lg mb-6">You haven't placed any orders yet. Start shopping!</p>
          <button
            onClick={() => (window.location.href = "/products")}
            className=" text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            My Orders
          </h1>
          <p className="text-gray-600 text-lg">Track and manage your orders</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all">
              <div className="bg-blue-900 p-6 text-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm opacity-90">Order ID</p>
                    <p className="text-xl font-bold">#{order.id}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full border-2 flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="text-xs font-semibold uppercase">{order.status}</span>
                  </div>
                </div>
                <p className="text-sm opacity-90">{formatDate(order.created_at)}</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Items:</p>
                  <div className="space-y-2">
                    {order.order_items?.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.product?.image_url || "https://via.placeholder.com/50"}
                          alt={item.product?.name || "Product"}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.product?.name || "Product"}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.order_items?.length > 2 && (
                      <p className="text-xs text-purple-600 font-semibold">+{order.order_items.length - 2} more items</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaPhone className="text-purple-500" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-pink-500 mt-1 flex-shrink-0" />
                    <span className="line-clamp-2">{order.address}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total:</span>
                    <span className="text-2xl font-bold text-purple-600">${parseFloat(order.total_price).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="flex-1 bg-blue-900 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    View Details
                  </button>

                  {order.status === "pending" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancelling === order.id}
                      className="px-4 bg-red-100 text-red-600 py-3 rounded-xl hover:bg-red-200 transition-all font-semibold disabled:opacity-50 flex items-center justify-center"
                    >
                      {cancelling === order.id ? <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" /> : <MdCancel className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="bg-blue-900 p-6 text-white sticky top-0 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Order Details</h2>
                  <p className="text-sm opacity-90">Order #{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all"
                >
                  <FaTimesCircle className="w-6 h-6 text-red-500" />
                </button>
              </div>

              {/* Order Status & Date */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="text-sm font-semibold uppercase">{selectedOrder.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">{formatDate(selectedOrder.created_at)}</p>
                </div>

                {/* Contact Info */}
                <div className="bg-purple-50 rounded-2xl p-4 space-y-3">
                  <h3 className="font-bold text-gray-800 mb-2">Contact Information</h3>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <FaPhone className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-800">{selectedOrder.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-pink-100 p-2 rounded-full">
                      <FaMapMarkerAlt className="text-pink-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Delivery Address</p>
                      <p className="font-semibold text-gray-800">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl items-center">
                        <img
                          src={item.product?.image_url || 'https://via.placeholder.com/80'}
                          alt={item.product?.name || 'Product'}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
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
                  <span className="text-3xl font-bold text-purple-600">${parseFloat(selectedOrder.total_price).toFixed(2)}</span>
                </div>

                {/* Cancel Order Button */}
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="w-full bg-red-100 text-red-600 py-3 rounded-xl hover:bg-red-200 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <MdCancel className="w-5 h-5" />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
