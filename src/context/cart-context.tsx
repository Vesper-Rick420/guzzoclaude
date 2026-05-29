"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartLineExtra = {
  id: string;
  name: string;
  price: number;
};

export type CartLineSauce = {
  id: string;
  name: string;
};

export type CartItem = {
  lineId: string;
  productId: string;
  name: string;
  unitPrice: number; // precio final por unidad: base + extras
  basePrice: number; // precio base del producto en BD
  image_url: string | null;
  quantity: number;
  extras: CartLineExtra[];
  removedIngredients: string[];
  sauces: CartLineSauce[];
};

type AddItemInput = {
  productId: string;
  name: string;
  basePrice: number;
  image_url: string | null;
  extras?: CartLineExtra[];
  removedIngredients?: string[];
  sauces?: CartLineSauce[];
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: AddItemInput, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "guzzo-cart";

// Genera una clave estable a partir de productId + extras + ingredientes
// quitados + salsas para fusionar lineas identicas y separar las personalizadas.
function buildLineId(
  productId: string,
  extras: CartLineExtra[],
  removed: string[],
  sauces: CartLineSauce[],
): string {
  if (
    extras.length === 0 &&
    removed.length === 0 &&
    sauces.length === 0
  )
    return productId;
  const extraIds = [...extras.map((e) => e.id)].sort().join(",");
  const removedNames = [...removed].sort().join(",");
  const sauceIds = [...sauces.map((s) => s.id)].sort().join(",");
  return `${productId}|e:${extraIds}|r:${removedNames}|s:${sauceIds}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Backwards compat: si encuentra el formato viejo (sin lineId), lo descarta.
        if (
          Array.isArray(parsed) &&
          parsed.every((i) => typeof i?.lineId === "string")
        ) {
          const normalized: CartItem[] = parsed.map((i) => ({
            ...i,
            sauces: Array.isArray(i.sauces) ? i.sauces : [],
            extras: Array.isArray(i.extras) ? i.extras : [],
            removedIngredients: Array.isArray(i.removedIngredients)
              ? i.removedIngredients
              : [],
          }));
          setItems(normalized);
        }
      }
    } catch {
      // carrito corrupto: se ignora
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(input: AddItemInput, quantity = 1) {
    const extras = input.extras ?? [];
    const removedIngredients = input.removedIngredients ?? [];
    const sauces = input.sauces ?? [];
    const extrasTotal = extras.reduce((s, e) => s + e.price, 0);
    const unitPrice =
      Math.round((input.basePrice + extrasTotal) * 100) / 100;
    const lineId = buildLineId(
      input.productId,
      extras,
      removedIngredients,
      sauces,
    );

    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [
        ...prev,
        {
          lineId,
          productId: input.productId,
          name: input.name,
          unitPrice,
          basePrice: input.basePrice,
          image_url: input.image_url,
          quantity,
          extras,
          removedIngredients,
          sauces,
        },
      ];
    });
  }

  function removeItem(lineId: string) {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }

  function updateQuantity(lineId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)),
    );
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
