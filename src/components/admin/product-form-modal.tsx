"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, UtensilsCrossed, Upload } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/types/db";

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
};

const inputClass =
  "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-guzzo-white outline-none transition-all placeholder:text-white/30 focus:border-guzzo-orange focus:ring-2 focus:ring-guzzo-orange/30";

export function ProductFormModal({
  open,
  onClose,
  product,
  categories,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Reinicia el formulario cada vez que se abre.
  useEffect(() => {
    if (!open) return;
    setName(product?.name ?? "");
    setDescription(product?.description ?? "");
    setPrice(product ? String(product.price) : "");
    setCategoryId(product?.category_id ?? categories[0]?.id ?? "");
    setIsActive(product?.is_active ?? true);
    setIsFeatured(product?.is_featured ?? false);
    setImageFile(null);
    setImagePreview(product?.image_url ?? null);
  }, [open, product, categories]);

  // Cerrar con Escape + bloquear scroll del fondo.
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

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = Number(price);
    if (!name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      toast.error("Ingresa un precio válido.");
      return;
    }
    if (!categoryId) {
      toast.error("Selecciona una categoría.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    let imageUrl = product?.image_url ?? null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop() ?? "png";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, imageFile);
      if (uploadError) {
        setLoading(false);
        toast.error("No se pudo subir la imagen.");
        return;
      }
      imageUrl = supabase.storage
        .from("product-images")
        .getPublicUrl(path).data.publicUrl;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: priceNum,
      category_id: categoryId,
      image_url: imageUrl,
      is_active: isActive,
      is_featured: isFeatured,
    };

    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    setLoading(false);
    if (error) {
      toast.error("No se pudo guardar el producto.");
      return;
    }
    toast.success(product ? "Producto actualizado." : "Producto creado.");
    onClose();
    router.refresh();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-guzzo-black p-6 shadow-2xl sm:rounded-3xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 rounded-full bg-white/5 p-2 text-white/70 transition-colors hover:text-guzzo-orange"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-heading text-xl font-black text-guzzo-white">
              {product ? "Editar producto" : "Crear producto"}
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              {/* Imagen */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Imagen
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UtensilsCrossed className="h-6 w-6 text-white/15" />
                    )}
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition-colors hover:border-guzzo-orange/40 hover:text-guzzo-orange">
                    <Upload className="h-4 w-4" />
                    Subir imagen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Nombre
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Guzzo Clásica"
                  className={inputClass}
                />
              </div>

              {/* Descripcion */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Ingredientes y detalles..."
                  className={cn(inputClass, "h-auto resize-none py-2.5")}
                />
              </div>

              {/* Precio + categoria */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Categoría
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={inputClass}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interruptores */}
              <div className="flex flex-col gap-3">
                <Toggle
                  checked={isActive}
                  onChange={setIsActive}
                  label="Producto activo (visible en el menú)"
                />
                <Toggle
                  checked={isFeatured}
                  onChange={setIsFeatured}
                  label="Destacado (aparece en Más vendidos)"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-xl bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-6 py-3 font-semibold text-guzzo-black transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              >
                {loading
                  ? "Guardando..."
                  : product
                    ? "Guardar cambios"
                    : "Crear producto"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-left"
    >
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-guzzo-orange" : "bg-white/15",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </span>
      <span className="text-sm text-white/80">{label}</span>
    </button>
  );
}
