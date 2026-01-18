// src/pages/frontend/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../../services/orderService";
import { createPayment, checkPaymentStatus, cancelPayment } from "../../services/paymentService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState(null);

  // Fetch order
  useEffect(() => {
    getOrder(orderId)
      .then(res => setOrder(res.data.data || res.data))
      .catch(() => setError("មិនអាចទាញយក Order បាន"));
  }, [orderId]);

  // Create payment
  const handleCreatePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await createPayment(orderId);
      console.log(res.data);
      
      if (res.data.success) {
        setPayment(res.data.payment);
        setPolling(true);
      } else setError(res.data.message || "Failed to create payment");
    } catch {
      setError("មានបញ្ហាក្នុងការបង្កើត Payment");
    } finally {
      setLoading(false);
    }
  };

  // Polling payment status
  useEffect(() => {
    if (!payment || !polling) return;
    const interval = setInterval(async () => {
      try {
        const res = await checkPaymentStatus(payment.id);
        if (res.data.success) {
          setPayment(prev => ({ ...prev, status: res.data.payment.status }));
          if (res.data.payment.status === "paid") {
            setPolling(false);
            setTimeout(() => navigate("/orders"), 2000);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [payment, polling, navigate]);

  // Cancel payment with confirm
  const handleCancel = async () => {
    if (!payment) return;
    if (!window.confirm("តើអ្នកចង់លុបចោល Payment នេះមែនទេ?")) return;

    try {
      const res = await cancelPayment(payment.id);
      if (res.data.success) {
        setPayment(prev => ({ ...prev, status: "cancelled" }));
        setPolling(false);
      } else setError(res.data.message || "មិនអាច cancel payment បាន");
    } catch {
      setError("មានបញ្ហាក្នុងការលុប Payment");
    }
  };

  // Status badge
  const StatusBadge = ({ status }) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
      failed: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status] || "bg-gray-100 text-gray-800"}`}>
        {status?.toUpperCase() || "PENDING"}
      </span>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-700">Payment Page</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {order && (
        <div className="space-y-2">
          <p><strong>Order Number:</strong> {order.order_number}</p>
          <p><strong>Total:</strong> {order.total_price} {order.currency || "USD"}</p>
          <p><strong>Order Status:</strong> <StatusBadge status={order.status} /></p>
        </div>
      )}

      {!payment ? (
        <button
          onClick={handleCreatePayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Creating Payment..." : "Pay with Bakong KHQR"}
        </button>
      ) : (
        <div className="text-center space-y-4">
          <p className="font-semibold">Payment Status: <StatusBadge status={payment.status || "pending"} /></p>

          {payment.qr_string && (
            <div className="flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(payment.qr_string)}&size=220x220`}
                alt="KHQR"
                className="mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleCancel}
              disabled={["paid", "cancelled"].includes(payment.status)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Cancel Payment
            </button>
          </div>

          {polling && (
            <div className="flex justify-center mt-2">
              <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-purple-600" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
