"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, UtensilsCrossed, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import {
  PRODUCT_EXTRAS,
  SAUCES,
  canCustomize,
  ingredientsForCategory,
  type ProductExtra,
  type Sauce,
} from "@/lib/burger-options";
import type { Product } from "@/types/db";

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
  categorySlug?: string | null;
};

export function ProductDetailModal({
  product,
  open,
  onClose,
  categorySlug,
}: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [removed, setRemoved] = useState<string[]>([]);
  const [chosenExtras, setChosenExtras] = useState<string[]>([]);
  const [chosenSauces, setChosenSauces] = useState<string[]>([]);

  const customizable = canCustomize(categorySlug);
  const isCombo = categorySlug === "combos";
  const ingredients = ingredientsForCategory(categorySlug);
  const basePrice = Number(product.price);

  const extrasTotal = useMemo(
    () =>
      chosenExtras.reduce((sum, id) => {
        const e = PRODUCT_EXTRAS.find((x) => x.id === id);
        return e ? sum + e.price : sum;
      }, 0),
    [chosenExtras],
  );

  const unitPrice = Math.round((basePrice + extrasTotal) * 100) / 100;

  useEffect(() => {
    if (open) {
      setQty(1);
      setRemoved([]);
      setChosenExtras([]);
      setChosenSauces([]);
    }
  }, [open]);

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

  function toggle<T>(list: T[], value: T): T[] {
    return list.includes(value)
      ? list.filter((x) => x !== value)
      : [...list, value];
  }

  function handleAdd() {
    const extras: ProductExtra[] = chosenExtras
      .map((id) => PRODUCT_EXTRAS.find((e) => e.id === id))
      .filter((e): e is ProductExtra => Boolean(e));

    const sauces: Sauce[] = chosenSauces
      .map((id) => SAUCES.find((s) => s.id === id))
      .filter((s): s is Sauce => Boolean(s));

    addItem(
      {
        productId: product.id,
        name: product.name,
        basePrice,
        image_url: product.image_url,
        extras: customizable ? extras : [],
        removedIngredients: customizable ? removed : [],
        sauces: customizable ? sauces : [],
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
            className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-guzzo-black shadow-2xl sm:rounded-3xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-2 text-white/70 backdrop-blur transition-colors hover:text-guzzo-orange"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex aspect-[16/10] shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-white/[0.07] to-transparent">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 512px"
                  className="object-cover"
                />
              ) : (
                <UtensilsCrossed className="h-16 w-16 text-white/15" />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
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
                {formatPrice(basePrice)}
              </span>

              {customizable && ingredients.length > 0 && (
                <CustomizationSection
                  title={isCombo ? "Componentes" : "Ingredientes"}
                  subtitle="Toca uno para quitarlo"
                >
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ing) => {
                      const isRemoved = removed.includes(ing);
                      return (
                        <button
                          key={ing}
                          type="button"
                          onClick={() =>
                            setRemoved((r) => toggle(r, ing))
                          }
                          className={
                            isRemoved
                              ? "rounded-full border border-red-400/40 bg-red-400/10 px-3 py-1.5 text-sm font-medium text-red-300 line-through transition-all"
                              : "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 transition-all hover:border-guzzo-orange/40"
                          }
                        >
                          {ing}
                        </button>
                      );
                    })}
                  </div>
                </CustomizationSection>
              )}

              {customizable && (
                <CustomizationSection
                  title="Extras"
                  subtitle="Suma al precio"
                >
                  <div className="flex flex-col gap-2">
                    {PRODUCT_EXTRAS.map((extra) => {
                      const isChosen = chosenExtras.includes(extra.id);
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() =>
                            setChosenExtras((c) => toggle(c, extra.id))
                          }
                          className={
                            isChosen
                              ? "flex items-center justify-between gap-3 rounded-xl border border-guzzo-orange/50 bg-guzzo-orange/10 px-3 py-2.5 text-left transition-all"
                              : "flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left transition-all hover:border-guzzo-orange/30"
                          }
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={
                                isChosen
                                  ? "flex h-5 w-5 items-center justify-center rounded-md bg-guzzo-orange text-guzzo-black"
                                  : "h-5 w-5 rounded-md border border-white/20"
                              }
                            >
                              {isChosen && (
                                <Check className="h-3.5 w-3.5" />
                              )}
                            </span>
                            <span className="text-sm font-medium text-guzzo-white">
                              {extra.name}
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-guzzo-orange">
                            +{formatPrice(extra.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CustomizationSection>
              )}

              {customizable && (
                <CustomizationSection
                  title="Salsas"
                  subtitle="Elegí las que quieras (gratis)"
                >
                  <div className="flex flex-wrap gap-2">
                    {SAUCES.map((sauce) => {
                      const isChosen = chosenSauces.includes(sauce.id);
                      return (
                        <button
                          key={sauce.id}
                          type="button"
                          onClick={() =>
                            setChosenSauces((c) => toggle(c, sauce.id))
                          }
                          className={
                            isChosen
                              ? "flex items-center gap-1.5 rounded-full border border-guzzo-orange/50 bg-guzzo-orange/10 px-3 py-1.5 text-sm font-medium text-guzzo-orange transition-all"
                              : "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 transition-all hover:border-guzzo-orange/30"
                          }
                        >
                          {isChosen && <Check className="h-3.5 w-3.5" />}
                          {sauce.name}
                        </button>
                      );
                    })}
                  </div>
                </CustomizationSection>
              )}
            </div>

            <div className="border-t border-white/10 bg-guzzo-black p-4">
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
                  Agregar {formatPrice(unitPrice * qty)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CustomizationSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-guzzo-orange">
          {title}
        </h3>
        <p className="text-xs text-white/40">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
