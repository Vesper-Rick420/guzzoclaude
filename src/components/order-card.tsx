import { ShoppingBag, UtensilsCrossed, Wallet, CreditCard } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/format";
import type { ProfileOrder, OrderStatus } from "@/types/db";

const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  pendiente: {
    label: "Pendiente",
    className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  },
  preparando: {
    label: "En preparación",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  },
  listo: {
    label: "Listo",
    className: "border-guzzo-orange/30 bg-guzzo-orange/10 text-guzzo-orange",
  },
  entregado: {
    label: "Entregado",
    className: "border-green-500/30 bg-green-500/10 text-green-400",
  },
  cancelado: {
    label: "Cancelado",
    className: "border-red-500/30 bg-red-500/10 text-red-400",
  },
};

export function OrderCard({ order }: { order: ProfileOrder }) {
  const status = STATUS[order.status] ?? STATUS.pendiente;
  const isTakeaway = order.order_type === "takeaway";
  const isCash = order.payment_method === "efectivo";
  // "transferencia" se trata como tarjeta a la hora de mostrarse.
  const paymentLabel = isCash
    ? "Efectivo"
    : order.payment_method === "transferencia"
      ? "Transferencia"
      : "Tarjeta";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-heading font-bold text-guzzo-white">
            Pedido #{order.id.slice(0, 8)}
          </p>
          <p className="text-xs text-white/40">
            {formatDate(order.created_at)}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
        <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-white/60">
          {isTakeaway ? (
            <ShoppingBag className="h-3.5 w-3.5" />
          ) : (
            <UtensilsCrossed className="h-3.5 w-3.5" />
          )}
          {isTakeaway ? "Para llevar" : "Para servirse"}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-white/60">
          {isCash ? (
            <Wallet className="h-3.5 w-3.5" />
          ) : (
            <CreditCard className="h-3.5 w-3.5" />
          )}
          {paymentLabel}
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5 border-t border-white/5 pt-3">
        {order.order_items.map((item, i) => (
          <li key={i} className="text-sm text-white/60">
            <div className="flex justify-between gap-3">
              <span>
                {item.quantity} x {item.products?.name ?? "Producto"}
              </span>
              <span className="shrink-0">
                {formatPrice(item.unit_price * item.quantity)}
              </span>
            </div>
            {item.notes && (
              <p className="mt-0.5 text-xs italic text-white/40">
                {item.notes}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex justify-between border-t border-white/5 pt-3">
        <span className="text-sm text-white/60">Total</span>
        <span className="font-heading font-extrabold text-guzzo-orange">
          {formatPrice(order.total)}
        </span>
      </div>
    </div>
  );
}
