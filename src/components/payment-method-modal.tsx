"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CreditCard, X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { PaymentMethod } from "@/context/order-mode-context";

type Props = {
  open: boolean;
  total: number;
  loading: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
};

export function PaymentMethodModal({
  open,
  total,
  loading,
  onClose,
  onConfirm,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={loading ? undefined : onClose}
          className="fixed inset-0 z-[130] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-t-3xl border border-white/10 bg-guzzo-black shadow-2xl sm:rounded-3xl"
          >
            {!loading && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-2 text-white/70 backdrop-blur transition-colors hover:text-guzzo-orange"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            <div className="flex flex-col items-center gap-2 bg-gradient-to-b from-guzzo-orange/10 to-transparent px-6 pb-3 pt-8 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-guzzo-orange">
                Total a pagar
              </p>
              <p className="font-heading text-4xl font-black text-guzzo-white">
                {formatPrice(total)}
              </p>
            </div>

            <div className="p-6 pt-2">
              <h2 className="mb-1 font-heading text-xl font-black text-guzzo-white">
                ¿Con qué vas a pagar?
              </h2>
              <p className="mb-5 text-sm text-white/55">
                Elegí un método para confirmar tu pedido
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PaymentButton
                  icon={<Wallet className="h-10 w-10" />}
                  label="Efectivo"
                  description="Pago en el local"
                  disabled={loading}
                  onClick={() => onConfirm("efectivo")}
                />
                <PaymentButton
                  icon={<CreditCard className="h-10 w-10" />}
                  label="Tarjeta"
                  description="Débito o crédito"
                  disabled={loading}
                  onClick={() => onConfirm("tarjeta")}
                />
              </div>

              {loading && (
                <p className="mt-4 text-center text-sm text-white/60">
                  Confirmando pedido...
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PaymentButton({
  icon,
  label,
  description,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition-all hover:border-guzzo-orange/50 hover:bg-guzzo-orange/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="text-guzzo-orange transition-transform group-hover:scale-110">
        {icon}
      </span>
      <span className="font-heading text-lg font-black text-guzzo-white">
        {label}
      </span>
      <span className="text-xs text-white/50">{description}</span>
    </button>
  );
}
