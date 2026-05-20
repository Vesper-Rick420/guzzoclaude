"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-guzzo-white outline-none transition-all placeholder:text-white/30 focus:border-guzzo-orange focus:ring-2 focus:ring-guzzo-orange/30";

export function RegisterExpense() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountNum = Number(amount);
    if (!description.trim()) {
      toast.error("Ingresa una descripción.");
      return;
    }
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      toast.error("Ingresa un monto válido.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("expenses")
      .insert({ description: description.trim(), amount: amountNum });
    setLoading(false);
    if (error) {
      toast.error("No se pudo registrar el gasto.");
      return;
    }
    toast.success("Gasto registrado.");
    setDescription("");
    setAmount("");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-guzzo-orange/40 hover:text-guzzo-orange"
      >
        <Plus className="h-4 w-4" />
        Registrar gasto
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-t-3xl border border-white/10 bg-guzzo-black p-6 shadow-2xl sm:rounded-3xl"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="absolute right-4 top-4 rounded-full bg-white/5 p-2 text-white/70 transition-colors hover:text-guzzo-orange"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="font-heading text-xl font-black text-guzzo-white">
                Registrar gasto
              </h2>

              <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Descripción
                  </label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Compra de insumos"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Monto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 rounded-xl bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-6 py-3 font-semibold text-guzzo-black transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar gasto"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
