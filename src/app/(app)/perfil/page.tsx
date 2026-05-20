import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Receipt, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileCard } from "@/components/profile-card";
import { OrderCard } from "@/components/order-card";
import { formatPrice } from "@/lib/format";
import type { ProfileOrder, UserProfile } from "@/types/db";

export const metadata: Metadata = {
  title: "Mi perfil | GUZZO",
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("users")
    .select("id, full_name, email, phone, cedula, role, created_at")
    .eq("id", user.id)
    .single();

  const { data: ordersData } = await supabase
    .from("orders")
    .select(
      "id, total, status, created_at, order_items(quantity, unit_price, products(name))",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const profile = profileData as UserProfile | null;
  // Supabase infiere la relacion anidada como arreglo; en realidad
  // products es un objeto (relacion muchos-a-uno), por eso el cast.
  const orders = (ordersData ?? []) as unknown as ProfileOrder[];
  const totalSpent = orders
    .filter((o) => o.status !== "cancelado")
    .reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-black text-guzzo-white sm:text-4xl">
        Mi perfil
      </h1>

      {profile && <ProfileCard profile={profile} />}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <StatCard
          icon={<Receipt className="h-5 w-5" />}
          label="Pedidos"
          value={String(orders.length)}
        />
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label="Total gastado"
          value={formatPrice(totalSpent)}
        />
      </div>

      <h2 className="mt-10 font-heading text-2xl font-black text-guzzo-white">
        Historial de pedidos
      </h2>
      {orders.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-white/50">
          Aún no has hecho ningún pedido. ¡Date el gusto!
        </p>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-guzzo-orange/10 text-guzzo-orange">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-white/40">
          {label}
        </p>
        <p className="font-heading text-xl font-extrabold text-guzzo-white">
          {value}
        </p>
      </div>
    </div>
  );
}
