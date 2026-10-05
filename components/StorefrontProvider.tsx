"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "@/lib/products";

const CART_STORAGE_KEY = "line-form-cart-v1";

type CartLine = { productId: string; quantity: number };
export type CartProductLine = { product: Product; quantity: number };

type CartContextValue = {
  cart: CartLine[];
  items: CartProductLine[];
  itemCount: number;
  subtotal: number;
  ready: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addToCart: (productId: string, quantity?: number) => void;
  changeQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const validItems = parsed.filter(
              (line): line is CartLine =>
                typeof line?.productId === "string" &&
                Boolean(getProduct(line.productId)) &&
                Number.isInteger(line.quantity) &&
                line.quantity > 0 &&
                line.quantity <= 50,
            );
            setCart(validItems);
          }
        }
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    if (!getProduct(productId) || !Number.isInteger(quantity) || quantity < 1) return;
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(50, item.quantity + quantity) }
            : item,
        );
      }
      return [...current, { productId, quantity: Math.min(quantity, 50) }];
    });
    setDrawerOpen(true);
  }, []);

  const changeQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.productId !== productId));
      return;
    }
    setCart((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(50, quantity) } : item,
      ),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const items = useMemo(
    () =>
      cart.flatMap((line) => {
        const product = getProduct(line.productId);
        return product ? [{ product, quantity: line.quantity }] : [];
      }),
    [cart],
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const value = useMemo(
    () => ({
      cart,
      items,
      itemCount,
      subtotal,
      ready: hydrated,
      drawerOpen,
      setDrawerOpen,
      addToCart,
      changeQuantity,
      removeFromCart,
      clearCart,
    }),
    [cart, items, itemCount, subtotal, hydrated, drawerOpen, addToCart, changeQuantity, removeFromCart, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within StorefrontProvider");
  return context;
}
