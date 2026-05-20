"use client";

import { useState } from "react";
import Image from "next/image";
import { UtensilsCrossed, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductDetailModal } from "@/components/product-detail-modal";
import type { Product } from "@/types/db";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [detailOpen, setDetailOpen] = useState(false);

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
    <>
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-guzzo-orange/40"
      >
        {/* Region clickeable: abre el detalle del producto */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setDetailOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setDetailOpen(true);
            }
          }}
          className="flex flex-1 cursor-pointer flex-col"
        >
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-white/[0.07] to-transparent">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <UtensilsCrossed className="h-12 w-12 text-white/15" />
            )}
            <div className="pointer-events-none absolute -bottom-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-guzzo-orange/20 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <h3 className="font-heading text-lg font-bold text-guzzo-white">
              {product.name}
            </h3>
            {product.description && (
              <p className="line-clamp-2 text-sm text-white/50">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Precio + boton agregar */}
        <div className="flex items-center justify-between px-4 pb-4">
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
      </motion.article>

      <ProductDetailModal
        product={product}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
