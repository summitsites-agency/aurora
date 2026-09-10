import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { cartReducer, emptyCart, cartCount, cartTotalCents } from './cartReducer.js';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};

const KEY = 'aurora.cart.v1';

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyCart;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.lines) ? parsed : emptyCart;
  } catch {
    return emptyCart;
  }
};

export default function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* private mode or quota — the cart just does not persist */
    }
  }, [state]);

  const value = useMemo(
    () => ({
      cart: state,
      dispatch,
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      count: cartCount(state),
      totalCents: cartTotalCents(state),
    }),
    [state, open],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
