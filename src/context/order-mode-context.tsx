"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type OrderType = "takeaway" | "dinein";
export type PaymentMethod = "efectivo" | "tarjeta";

type OrderModeContextValue = {
  orderType: OrderType | null;
  paymentMethod: PaymentMethod;
  needsSelection: boolean;
  setOrderType: (t: OrderType) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  resetOrderType: () => void;
};

const OrderModeContext = createContext<OrderModeContextValue | null>(null);
const SESSION_KEY = "guzzo-order-type";
const PAYMENT_KEY = "guzzo-payment-method";

export function OrderModeProvider({ children }: { children: ReactNode }) {
  const [orderType, setOrderTypeState] = useState<OrderType | null>(null);
  const [paymentMethod, setPaymentMethodState] =
    useState<PaymentMethod>("efectivo");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      // orderType en sessionStorage: se borra al cerrar la pestaña,
      // asi el modal de bienvenida vuelve a aparecer en la proxima visita.
      const savedType = sessionStorage.getItem(SESSION_KEY);
      if (savedType === "takeaway" || savedType === "dinein") {
        setOrderTypeState(savedType);
      }
      // paymentMethod en localStorage: recordamos la preferencia del cliente.
      const savedPay = localStorage.getItem(PAYMENT_KEY);
      if (savedPay === "efectivo" || savedPay === "tarjeta") {
        setPaymentMethodState(savedPay);
      }
    } catch {
      // estado corrupto: se ignora
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (orderType) sessionStorage.setItem(SESSION_KEY, orderType);
    else sessionStorage.removeItem(SESSION_KEY);
  }, [orderType, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PAYMENT_KEY, paymentMethod);
  }, [paymentMethod, hydrated]);

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
