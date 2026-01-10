// src/services/paymentService.js
import api from "../../api/axios";

// create payment for an order (generate KHQR)
export const createPayment = (orderId) => api.post(`/bakong/pay/${orderId}`);

// check payment status
export const checkPaymentStatus = (paymentId) =>
  api.get(`/bakong/check/${paymentId}`);

// cancel payment
export const cancelPayment = (paymentId) =>
  api.post(`/bakong/cancel/${paymentId}`); // បើ Laravel មាន route /payments/{id} DELETE
