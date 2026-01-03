// CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getCart, addToCart, updateCart, removeProduct, clearCart } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔹 Load cart from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems([]);
      setCartCount(0);
      setLoading(false);
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      const items = res.data.data || [];
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      console.error("Fetch cart failed:", error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add item to cart
  const addItem = async (productId, quantity = 1) => {
    try {
      await addToCart({ product_id: productId, quantity });
      // Update local state instantly
      setCartItems(prev => {
        const existing = prev.find(i => i.product.id === productId);
        if (existing) {
          return prev.map(i =>
            i.product.id === productId ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          // Optionally refetch from backend if needed
          fetchCart();
          return prev;
        }
      });
      setCartCount(prev => prev + quantity);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  // 🔹 Update quantity
  const updateItem = async (cartId, newQuantity) => {
    try {
      await updateCart(cartId, newQuantity);
      setCartItems(prev =>
        prev.map(i => (i.id === cartId ? { ...i, quantity: newQuantity } : i))
      );
      setCartCount(prev => {
        const total = cartItems.reduce((sum, i) =>
          i.id === cartId ? sum + newQuantity : sum + i.quantity
        , 0);
        return total;
      });
    } catch (error) {
      console.error("Update cart failed:", error);
    }
  };

  // 🔹 Remove item
  const removeItem = async (productId) => {
    try {
      await removeProduct(productId);
      setCartItems(prev => prev.filter(i => i.product.id !== productId));
      setCartCount(prev => {
        const removed = cartItems.find(i => i.product.id === productId);
        return removed ? prev - removed.quantity : prev;
      });
    } catch (error) {
      console.error("Remove product failed:", error);
    }
  };

  // 🔹 Clear cart
  const clearAll = async () => {
    try {
      await clearCart();
      setCartItems([]);
      setCartCount(0);
    } catch (error) {
      console.error("Clear cart failed:", error);
    }
  };

  // 🔹 Reset on logout
  const resetCart = () => {
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        addItem,
        updateItem,
        removeItem,
        clearAll,
        resetCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
