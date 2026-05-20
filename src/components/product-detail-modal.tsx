"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/db";

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
};

export function ProductDetailModal({ product, open, onClose }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (open) setQty(1);
  }, [open]);

  // Cerrar con Escape y bloquear el scroll del fondo.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function handleAdd() {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
      },
      qty,
    );
    toast.success(`${qty} x ${product.name} agregado al carrito`);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-t-3xl border border-white/10 bg-guzzo-black shadow-2xl sm:rounded-3xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-2 text-white/70 backdrop-blur transition-colors hover:text-guzzo-orange"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-white/[0.07] to-transparent">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UtensilsCrossed className="h-16 w-16 text-white/15" />
              )}
            </div>

            <div className="flex flex-col gap-4 p-6">
              <div>
                <h2 className="font-heading text-2xl font-black text-guzzo-white">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="mt-1 text-sm text-white/55">
                    {product.description}
                  </p>
                )}
              </div>

              <span className="font-heading text-3xl font-extrabold text-guzzo-orange">
                {formatPrice(Number(product.price))}
              </span>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Quitar uno"
                    className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-guzzo-orange"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-semibold text-guzzo-white">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Agregar uno"
                    className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-guzzo-orange"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-5 py-3 font-semibold text-guzzo-black transition-all hover:brightness-110 active:scale-95"
                >
                  Agregar {formatPrice(Number(product.price) * qty)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
