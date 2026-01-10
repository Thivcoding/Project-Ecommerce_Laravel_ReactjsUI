import React, { useState, useEffect, useRef } from "react";
import {
  FaEye,
  FaTimesCircle,
  FaCheckCircle,
  FaClock,
  FaBox,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { useOrders } from "../../context/OrderContext";
import {
  createPayment,
  checkPaymentStatus,
} from "../../services/paymentService";

const Orders = () => {
  const {
    orders,
    loading: ordersLoading,
    fetchOrders,
    cancelOrderById,
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [error, setError] = useState(null);

  // Payment states
  const [payment, setPayment] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // For description "view more"
  const [showFullDesc, setShowFullDesc] = useState({});

  // Polling ref
  const pollingRef = useRef(null);

  /* ===================== LOAD ORDERS ===================== */
  useEffect(() => {
    fetchOrders().catch(() => setError("Failed to load orders"));
  }, []);

  useEffect(() => {
    if (!selectedOrder) return;
    const updatedOrder = orders.find((o) => o.id === selectedOrder.id);
    if (updatedOrder) setSelectedOrder(updatedOrder);
  }, [orders]);

  /* ===================== VIEW ORDER ===================== */
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setPayment(null);
    setShowFullDesc({});
    setShowModal(true);
  };

  /* ===================== CANCEL ORDER ===================== */
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(orderId);
    try {
      await cancelOrderById(orderId);
      await fetchOrders();
    } catch {
      alert("Failed to cancel order");
    } finally {
      setCancelling(null);
    }
  };

  /* ===================== CREATE PAYMENT ===================== */
  const handlePay = async (orderId) => {
    setLoadingPayment(true);
    try {
      const res = await createPayment(orderId);

      if (res.data.status === "success" && res.data.payment) {
        setPayment(res.data.payment);
        startPolling(res.data.payment.id);
      } else {
        alert(res.data.message || "Failed to create payment");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating payment");
    } finally {
      setLoadingPayment(false);
    }
  };

  /* ===================== CHECK PAYMENT ===================== */
  const handleCheckPayment = async () => {
    if (!payment?.id) return;
    setCheckingStatus(true);

    try {
      const res = await checkPaymentStatus(payment.id);

      if (res.data.status === "success" && res.data.payment) {
        const updatedPayment = res.data.payment;
        setPayment(updatedPayment);

        if (updatedPayment.status === "paid") {
          stopPolling();
          await fetchOrders();
          setTimeout(() => closeModal(), 800);
        }
      }
    } catch (err) {
      console.error("Check payment error:", err);
    } finally {
      setCheckingStatus(false);
    }
  };

  /* ===================== POLLING ===================== */
  const startPolling = (paymentId) => {
    stopPolling();

    pollingRef.current = setInterval(async () => {
      try {
        const res = await checkPaymentStatus(paymentId);
        if (res.data?.payment) {
          const status = res.data.payment.status;
          setPayment(res.data.payment);

          if (status === "paid") {
            stopPolling();
            await fetchOrders();
            setTimeout(closeModal, 800);
          }
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 5000);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  /* ===================== CLOSE MODAL ===================== */
  const closeModal = () => {
    stopPolling();
    setShowModal(false);
    setPayment(null);
    setSelectedOrder(null);
  };

  /* ===================== HELPERS ===================== */
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "paid":
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
      case "paid":
        return <FaCheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <MdCancel className="w-4 h-4" />;
      default:
        return <FaBox className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString();

  /* ===================== UI ===================== */
  if (ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AiOutlineLoading3Quarters className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error)
    return <div className="text-center mt-12 text-red-500">{error}</div>;
  if (orders.length === 0)
    return <div className="text-center mt-12">No Orders Yet</div>;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">My Orders</h1>

        {/* ===== Orders Grid ===== */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="bg-blue-900 p-6 text-white flex justify-between">
                <div>
                  <p>Order #{order.id}</p>
                  <p className="text-sm">{formatDate(order.created_at)}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full border-2 flex items-center gap-2 ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="text-xs font-semibold uppercase">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-xl font-bold text-purple-600">
                  ${parseFloat(order.total_price).toFixed(2)}
                </p>

                <button
                  onClick={() => handleViewOrder(order)}
                  className="w-full mt-4 bg-blue-900 text-white py-3 rounded-xl font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ===== MODAL ===== */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4"
              >
                <FaTimesCircle className="text-red-500 text-2xl" />
              </button>

              <h2 className="text-2xl font-bold mb-4">
                Order #{selectedOrder.id}
              </h2>

              {/* ===== Order Items ===== */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedOrder.order_items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl items-start"
                  >
                    <img
                      src={
                        item.product?.image_url ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product?.name}</h4>

                      {item.product?.description && (
                        <p className="text-gray-600 text-sm">
                          {showFullDesc[idx]
                            ? item.product.description
                            : item.product.description.slice(0, 80) + "..."}
                          {item.product.description.length > 80 && (
                            <button
                              onClick={() =>
                                setShowFullDesc((prev) => ({
                                  ...prev,
                                  [idx]: !prev[idx],
                                }))
                              }
                              className="ml-1 text-blue-600 underline text-sm"
                            >
                              {showFullDesc[idx] ? "View less" : "View more"}
                            </button>
                          )}
                        </p>
                      )}

                      <p>Qty: {item.quantity}</p>
                      <p className="text-purple-600 font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ===== Total ===== */}
              <div className="flex justify-between items-center mt-4 font-bold text-lg">
                <span>Total:</span>
                <span className="text-purple-600">
                  ${parseFloat(selectedOrder.total_price).toFixed(2)}
                </span>
              </div>

              {/* ===== Payment Section ===== */}
              <div className="mt-6 p-4 bg-blue-50 rounded-2xl space-y-4">
                {!payment ? (
                  <button
                    onClick={() => handlePay(selectedOrder.id)}
                    disabled={loadingPayment}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
                  >
                    {loadingPayment ? "Generating QR..." : "Pay with Bakong KHQR"}
                  </button>
                ) : (
                  <div className="space-y-4 text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                        payment.qr_string
                      )}&size=200x200`}
                      alt="KHQR"
                      className="mx-auto"
                    />
                    <p>Status: <strong>{payment.status}</strong></p>
                    <button
                      onClick={handleCheckPayment}
                      disabled={checkingStatus}
                      className="w-full bg-green-500 text-white py-2 rounded-xl"
                    >
                      {checkingStatus ? "Checking..." : "Check Payment Status"}
                    </button>
                  </div>
                )}
              </div>

              {/* ===== Cancel Order Button ===== */}
              {selectedOrder.status === "pending" && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="w-full bg-red-100 text-red-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-4"
                >
                  <MdCancel className="w-5 h-5" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
