"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  priceCents: number;
  color: string;
  // Taille choisie sur la fiche produit, pour les articles qui en ont.
  variant?: string;
  quantity: number;
};

// Une ligne de panier par article et par taille.
export function cartKey(item: Pick<CartItem, "productId" | "variant">) {
  return `${item.productId}:${item.variant ?? ""}`;
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  totalCents: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bar-a-teckels:panier";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydratation depuis le stockage local
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // Stockage indisponible : panier vide.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignoré : le panier reste en mémoire.
    }
  }, [items, loaded]);

  const add = useCallback<CartContextValue["add"]>((item, quantity = 1) => {
    setItems((current) => {
      const key = cartKey(item);
      const existing = current.find((i) => cartKey(i) === key);
      if (existing) {
        return current.map((i) => (cartKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...current, { ...item, quantity }];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((i) => cartKey(i) !== key)
        : current.map((i) => (cartKey(i) === key ? { ...i, quantity } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      totalCents: items.reduce((n, i) => n + i.quantity * i.priceCents, 0),
      add,
      setQuantity,
      clear,
    }),
    [items, add, setQuantity, clear],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un CartProvider");
  return ctx;
}
