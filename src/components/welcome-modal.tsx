"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useOrderMode } from "@/context/order-mode-context";
import { GuzzoLogo } from "@/components/guzzo-logo";

export function WelcomeModal() {
  const { needsSelection, setOrderType } = useOrderMode();

  return (
    <AnimatePresence>
      {needsSelection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-guzzo-black/85 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: 30, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-guzzo-black shadow-2xl"
          >
            <div className="flex flex-col items-center gap-3 bg-gradient-to-b from-guzzo-orange/10 to-transparent px-6 pb-4 pt-8 text-center">
              <GuzzoLogo className="text-4xl" />
              <p className="text-xs uppercase tracking-[0.3em] text-guzzo-orange">
                Bienvenido
              </p>
              <h2 className="font-heading text-2xl font-black text-guzzo-white">
                ¿Cómo querés tu pedido?
              </h2>
              <p className="-mt-1 text-sm text-white/55">
                Elegí una opción para empezar
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 p-6 pt-2 sm:grid-cols-2">
              <ModeButton
                icon={<ShoppingBag className="h-10 w-10" />}
                label="Para llevar"
                description="Lo retiro en el local"
                onClick={() => setOrderType("takeaway")}
              />
              <ModeButton
                icon={<UtensilsCrossed className="h-10 w-10" />}
                label="Para servirse"
                description="Comer aquí en el local"
                onClick={() => setOrderType("dinein")}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModeButton({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition-all hover:border-guzzo-orange/50 hover:bg-guzzo-orange/5 active:scale-[0.98]"
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
