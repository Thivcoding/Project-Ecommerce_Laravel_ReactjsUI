import React, { createContext, useContext, useState, useEffect } from "react";
import { getOrders, cancelOrder } from "../services/orderService";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new order (show immediately)
  const addOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  // Remove order from state
  // const removeOrder = (orderId) => {
  //   setOrders(prev => prev.filter(o => o.id !== orderId));
  // };

  // Cancel an order
  const cancelOrderById = async (orderId) => {
    //  Update UI immediately
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: "cancelled" }
          : order
      )
    );

    try {
      const response = await cancelOrder(orderId);

      if (!response.data.success) {
        throw new Error("Cancel failed");
      }

      return response.data;

    } catch (err) {
      console.error("Failed to cancel order", err);

      //rollback if API failed
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: "pending" }
            : order
        )
      );

      throw err;
    }
  };

  // Count of active (non-cancelled) orders
  const activeOrdersCount = orders.filter(o => o.status !== "cancelled").length;

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      addOrder,
      cancelOrderById,
      fetchOrders,
      activeOrdersCount
    }}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook to use orders context
export const useOrders = () => useContext(OrderContext);
