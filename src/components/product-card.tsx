"use client";

import { UtensilsCrossed, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/db";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
    });
    toast.success(`${product.name} agregado al carrito`);
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-guzzo-orange/40"
    >
      {/* Imagen o marcador de posicion */}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-white/[0.07] to-transparent">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <UtensilsCrossed className="h-12 w-12 text-white/15" />
        )}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-guzzo-orange/20 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-lg font-bold text-guzzo-white">
          {product.name}
        </h3>
        {product.description && (
          <p className="line-clamp-2 text-sm text-white/50">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-heading text-xl font-extrabold text-guzzo-orange">
            {formatPrice(Number(product.price))}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-3 py-2 text-sm font-semibold text-guzzo-black transition-all hover:brightness-110 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>
    </motion.article>
  );
}
