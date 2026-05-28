"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type OrderType = "takeaway" | "dinein";
export type PaymentMethod = "efectivo" | "transferencia";

type OrderModeContextValue = {
  orderType: OrderType | null;
  paymentMethod: PaymentMethod;
  needsSelection: boolean;
  setOrderType: (t: OrderType) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  resetOrderType: () => void;
};

const OrderModeContext = createContext<OrderModeContextValue | null>(null);
const STORAGE_KEY = "guzzo-order-mode";

type StoredState = {
  orderType: OrderType | null;
  paymentMethod: PaymentMethod;
};

export function OrderModeProvider({ children }: { children: ReactNode }) {
  const [orderType, setOrderTypeState] = useState<OrderType | null>(null);
  const [paymentMethod, setPaymentMethodState] =
    useState<PaymentMethod>("efectivo");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as StoredState;
        if (parsed.orderType === "takeaway" || parsed.orderType === "dinein") {
          setOrderTypeState(parsed.orderType);
        }
        if (
          parsed.paymentMethod === "efectivo" ||
          parsed.paymentMethod === "transferencia"
        ) {
          setPaymentMethodState(parsed.paymentMethod);
        }
      }
    } catch {
      // estado corrupto: se ignora
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const data: StoredState = { orderType, paymentMethod };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [orderType, paymentMethod, hydrated]);

  // needsSelection es true solo cuando ya hidratamos Y no hay seleccion guardada.
  // Evita parpadeo del modal en la primera carga (SSR -> CSR).
  const needsSelection = hydrated && orderType === null;

  return (
    <OrderModeContext.Provider
      value={{
        orderType,
        paymentMethod,
        needsSelection,
        setOrderType: setOrderTypeState,
        setPaymentMethod: setPaymentMethodState,
        resetOrderType: () => setOrderTypeState(null),
      }}
    >
      {children}
    </OrderModeContext.Provider>
  );
}

export function useOrderMode() {
  const ctx = useContext(OrderModeContext);
  if (!ctx)
    throw new Error("useOrderMode debe usarse dentro de <OrderModeProvider>");
  return ctx;
}
