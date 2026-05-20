"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProductFormModal } from "@/components/admin/product-form-modal";
import type { Product, Category } from "@/types/db";

type Props = {
  products: Product[];
  categories: Category[];
};

export function ProductManager({ products, categories }: Props) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const categoryName = (id: string | null) =>
    categories.find((c) => c.id === id)?.name ?? "Sin categoría";

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setFormOpen(true);
  }

  async function toggleActive(product: Product) {
    setBusyId(product.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);
    setBusyId(null);
    if (error) {
      toast.error("No se pudo actualizar el producto.");
      return;
    }
    toast.success(
      product.is_active ? "Producto desactivado." : "Producto activado.",
    );
    router.refresh();
  }

  async function deleteProduct(id: string) {
    setBusyId(id);
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    setBusyId(null);
    setDeletingId(null);
    if (error) {
      toast.error("No se pudo eliminar el producto.");
      return;
    }
    toast.success("Producto eliminado.");
    router.refresh();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-black text-guzzo-white sm:text-3xl">
            Productos
          </h1>
          <p className="text-sm text-white/40">
            {products.length} producto{products.length === 1 ? "" : "s"} en el
            menú
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-4 py-2.5 text-sm font-semibold text-guzzo-black transition-all hover:brightness-110 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Crear producto
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {products.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/40">
            Aún no hay productos. Crea el primero.
          </p>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.07] to-transparent">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <UtensilsCrossed className="h-5 w-5 text-white/15" />
              )}
            </div>

            <div className="min-w-[140px] flex-1">
              <p className="font-heading font-bold text-guzzo-white">
                {product.name}
              </p>
              <p className="text-xs text-white/40">
                {categoryName(product.category_id)}
                {product.is_featured && " · Destacado"}
              </p>
            </div>

            <span className="font-heading font-extrabold text-guzzo-orange">
              {formatPrice(Number(product.price))}
            </span>

            <button
              type="button"
              onClick={() => toggleActive(product)}
              disabled={busyId === product.id}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50",
                product.is_active
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-white/15 bg-white/5 text-white/40",
              )}
            >
              {product.is_active ? "Activo" : "Inactivo"}
            </button>

            <div className="flex items-center gap-1">
              {deletingId === product.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    disabled={busyId === product.id}
                    className="rounded-lg bg-red-500/20 px-2.5 py-1.5 text-xs font-semibold text-red-400 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="rounded-lg px-2.5 py-1.5 text-xs text-white/50"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    aria-label="Editar producto"
                    className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-guzzo-orange"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(product.id)}
                    aria-label="Eliminar producto"
                    className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editing}
        categories={categories}
      />
    </div>
  );
}
