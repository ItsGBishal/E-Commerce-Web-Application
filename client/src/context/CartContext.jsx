import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const sync = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem('cart', JSON.stringify(nextItems));
  };

  const addToCart = (product, quantity = 1) => {
    const requestedQuantity = Number(quantity) || 1;
    const existing = items.find((item) => item._id === product._id);

    if (existing) {
      sync(
        items.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + requestedQuantity, product.stock) }
            : item
        )
      );
      return;
    }

    sync([...items, { ...product, quantity: Math.min(requestedQuantity, product.stock) }]);
  };

  const updateQuantity = (productId, quantity) => {
    const nextQuantity = Number(quantity);
    sync(
      items.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, Math.min(nextQuantity, item.stock)) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    sync(items.filter((item) => item._id !== productId));
  };

  const clearCart = () => sync([]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      tax,
      total,
      itemCount
    }),
    [items, subtotal, tax, total, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
