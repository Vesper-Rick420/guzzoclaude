"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  UtensilsCrossed,
  CheckCircle2,
  Wallet,
  ArrowLeftRight,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { useOrderMode } from "@/context/order-mode-context";
import { formatPrice } from "@/lib/format";
import { createOrder } from "@/lib/actions/orders";

export function CartView() {
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const {
    orderType,
    paymentMethod,
    setOrderType,
    setPaymentMethod,
  } = useOrderMode();
  const [loading, setLoading] = useState(false);
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);

  async function handleConfirm() {
    if (!orderType) {
      toast.error("Elegí 'Para llevar' o 'Para servirse' primero.");
      return;
    }
    setLoading(true);
    const result = await createOrder({
      lines: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        extraIds: i.extras.map((e) => e.id),
        removedIngredients: i.removedIngredients,
        sauceIds: i.sauces.map((s) => s.id),
      })),
      orderType,
      paymentMethod,
    });
    setLoading(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    setConfirmedTotal(result.total);
    clear();
    toast.success("¡Pedido confirmado!");
  }

  if (confirmedTotal !== null) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-guzzo-orange" />
        <h1 className="font-heading text-3xl font-black text-guzzo-white">
          ¡Pedido confirmado!
        </h1>
        <p className="text-white/60">
          Tu pedido por{" "}
          <strong className="text-guzzo-orange">
            {formatPrice(confirmedTotal)}
          </strong>{" "}
          fue registrado. Pronto podrás seguir su estado en tu perfil.
        </p>
        <Link
          href="/menu"
          className="mt-2 rounded-xl bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-6 py-3 font-semibold text-guzzo-black transition-all hover:brightness-110"
        >
          Seguir pidiendo
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-white/15" />
        <h1 className="font-heading text-2xl font-black text-guzzo-white">
          Tu carrito está vacío
        </h1>
        <p className="text-white/50">
          Agrega productos del menú para empezar tu pedido.
        </p>
        <Link
          href="/menu"
          className="mt-2 rounded-xl bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-6 py-3 font-semibold text-guzzo-black transition-all hover:brightness-110"
        >
          Ver el menú
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-black text-guzzo-white sm:text-4xl">
        Tu carrito
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.lineId}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.07] to-transparent">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <UtensilsCrossed className="h-7 w-7 text-white/15" />
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading font-bold text-guzzo-white">
                    {item.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItem(item.lineId)}
                    aria-label="Quitar producto"
                    className="rounded-lg p-1 text-white/40 transition-colors hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-white/40">
                  {formatPrice(item.unitPrice)} c/u
                </span>

                {(item.removedIngredients.length > 0 ||
                  item.extras.length > 0 ||
                  item.sauces.length > 0) && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                    {item.removedIngredients.map((ing) => (
                      <span
                        key={`r-${ing}`}
                        className="rounded-full bg-red-400/10 px-2 py-0.5 text-red-300 line-through"
                      >
                        {ing}
                      </span>
                    ))}
                    {item.extras.map((e) => (
                      <span
                        key={`e-${e.id}`}
                        className="rounded-full bg-guzzo-orange/15 px-2 py-0.5 text-guzzo-orange"
                      >
                        + {e.name}
                      </span>
                    ))}
                    {item.sauces.map((s) => (
                      <span
                        key={`s-${s.id}`}
                        className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-yellow-300"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.lineId, item.quantity - 1)
                      }
                      aria-label="Quitar uno"
                      className="rounded p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-guzzo-orange"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold text-guzzo-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.lineId, item.quantity + 1)
                      }
                      aria-label="Agregar uno"
                      className="rounded p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-guzzo-orange"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-heading font-extrabold text-guzzo-orange">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="flex h-fit flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          {/* Tipo de pedido */}
          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-guzzo-orange">
              Tipo de pedido
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <ChoiceButton
                active={orderType === "takeaway"}
                onClick={() => setOrderType("takeaway")}
                icon={<ShoppingBag className="h-5 w-5" />}
                label="Para llevar"
              />
              <ChoiceButton
                active={orderType === "dinein"}
                onClick={() => setOrderType("dinein")}
                icon={<UtensilsCrossed className="h-5 w-5" />}
                label="Servirse"
              />
            </div>
          </section>

          {/* Metodo de pago */}
          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-guzzo-orange">
              Pagar con
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <ChoiceButton
                active={paymentMethod === "efectivo"}
                onClick={() => setPaymentMethod("efectivo")}
                icon={<Wallet className="h-5 w-5" />}
                label="Efectivo"
              />
              <ChoiceButton
                active={paymentMethod === "transferencia"}
                onClick={() => setPaymentMethod("transferencia")}
                icon={<ArrowLeftRight className="h-5 w-5" />}
                label="Transferencia"
              />
            </div>
          </section>

          {/* Totales */}
          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-guzzo-orange">
              Resumen
            </h2>
            <div className="mt-2 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Envío</span>
                <span className="text-guzzo-orange">Gratis</span>
              </div>
              <div className="my-2 h-px bg-white/10" />
              <div className="flex justify-between text-base font-bold text-guzzo-white">
                <span>Total</span>
                <span className="font-heading text-guzzo-orange">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </section>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-6 py-3 font-semibold text-guzzo-black transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Confirmando..." : "Confirmar pedido"}
          </button>
        </aside>
      </div>
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex flex-col items-center gap-1.5 rounded-xl border border-guzzo-orange/60 bg-guzzo-orange/10 px-3 py-3 text-guzzo-orange transition-all"
          : "flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white/70 transition-all hover:border-guzzo-orange/30 hover:text-guzzo-white"
      }
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}
