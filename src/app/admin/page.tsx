import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  ShoppingBag,
  Users,
  Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { RegisterExpense } from "@/components/admin/register-expense";

export const metadata: Metadata = {
  title: "Dashboard | Admin GUZZO",
};

type OrderRow = {
  id: string;
  total: number;
  status: string;
  created_at: string;
};
type ItemRow = {
  quantity: number;
  products: { name: string; category_id: string | null } | null;
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [ordersRes, itemsRes, usersRes, expensesRes, categoriesRes] =
    await Promise.all([
      supabase.from("orders").select("id, total, status, created_at"),
      supabase
        .from("order_items")
        .select("quantity, products(name, category_id)"),
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("expenses").select("amount"),
      supabase.from("categories").select("id, name"),
    ]);

  const orders = (ordersRes.data ?? []) as OrderRow[];
  const items = (itemsRes.data ?? []) as unknown as ItemRow[];
  const userCount = usersRes.count ?? 0;
  const expenses = (expensesRes.data ?? []) as { amount: number }[];
  const categories = (categoriesRes.data ?? []) as {
    id: string;
    name: string;
  }[];

  // --- Calculos ---
  const validOrders = orders.filter((o) => o.status !== "cancelado");
  const income = validOrders.reduce((s, o) => s + Number(o.total), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);

  const now = new Date();
  const monthKey = now.toISOString().slice(0, 7);
  const salesMonth = validOrders
    .filter((o) => o.created_at.slice(0, 7) === monthKey)
    .reduce((s, o) => s + Number(o.total), 0);

  // Productos mas vendidos (barra)
  const productMap = new Map<string, number>();
  for (const it of items) {
    const name = it.products?.name ?? "Producto";
    productMap.set(name, (productMap.get(name) ?? 0) + it.quantity);
  }
  const topProducts = [...productMap.entries()]
    .map(([name, cantidad]) => ({ name, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 6);

  // Ventas por categoria (pastel)
  const catMap = new Map<string, number>();
  for (const it of items) {
    const catName =
      categories.find((c) => c.id === it.products?.category_id)?.name ??
      "Otros";
    catMap.set(catName, (catMap.get(catName) ?? 0) + it.quantity);
  }
  const categoryData = [...catMap.entries()].map(([name, value]) => ({
    name,
    value,
  }));

  // Ventas de los ultimos 7 dias (linea)
  const dailySales: { dia: string; ventas: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const ventas = validOrders
      .filter((o) => o.created_at.slice(0, 10) === key)
      .reduce((s, o) => s + Number(o.total), 0);
    dailySales.push({
      dia: d.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
      ventas: Math.round(ventas * 100) / 100,
    });
  }

  const stats = [
    {
      icon: <DollarSign className="h-4 w-4" />,
      label: "Ingresos totales",
      value: formatPrice(income),
    },
    {
      icon: <TrendingDown className="h-4 w-4" />,
      label: "Gastos",
      value: formatPrice(totalExpenses),
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Ganancia neta",
      value: formatPrice(income - totalExpenses),
    },
    {
      icon: <ShoppingBag className="h-4 w-4" />,
      label: "Pedidos totales",
      value: String(orders.length),
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Usuarios",
      value: String(userCount),
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Ventas del mes",
      value: formatPrice(salesMonth),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-black text-guzzo-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-white/40">Resumen del negocio</p>
        </div>
        <RegisterExpense />
      </div>

      {/* Tarjetas de estadisticas */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            icon={s.icon}
            label={s.label}
            value={s.value}
          />
        ))}
      </div>

      {/* Graficas */}
      <div className="mt-6">
        <DashboardCharts
          topProducts={topProducts}
          categoryData={categoryData}
          dailySales={dailySales}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-white/40">
        <span className="text-guzzo-orange">{icon}</span>
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-heading text-2xl font-extrabold text-guzzo-white">
        {value}
      </p>
    </div>
  );
}
