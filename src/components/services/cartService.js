import api from "../../api/axios";

// get cart
export const getCart = () => api.get("/cart");

// add or update product
export const addToCart = (data) =>
  api.post("/cart", {
    product_id: data.product_id,
    quantity: data.quantity,
  });

// update quantity
export const updateCart = (id, quantity) =>
  api.put(`/cart/${id}`, { quantity });

// remove by product
export const removeProduct = (productId) =>
  api.delete(`/cart/product/${productId}`);

// clear cart
export const clearCart = () => api.delete("/cart/clear");
