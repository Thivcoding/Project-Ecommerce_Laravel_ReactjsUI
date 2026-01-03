import api from "../../api/axios";

// get all orders
export const getOrders = () => api.get("/orders");

// create order from cart
export const createOrder = (data) =>
  api.post("/orders", {
    phone: data.phone,
    address: data.address,
  });

// get order detail
export const getOrder = (id) => api.get(`/orders/${id}`);

// cancel order
export const cancelOrder = (id) => api.delete(`/orders/${id}`);
