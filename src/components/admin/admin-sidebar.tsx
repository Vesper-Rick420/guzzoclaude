"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Store,
  LogOut,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { GuzzoLogo } from "@/components/guzzo-logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Productos", href: "/admin/productos", icon: Package, exact: false },
  { label: "Usuarios", href: "/admin/usuarios", icon: Users, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Sesion cerrada.");
    router.push("/login");
    router.refresh();
  }

  const navItems = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt text-guzzo-black"
                : "text-white/70 hover:bg-white/5 hover:text-guzzo-orange",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footerLinks = (
    <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
      <Link
        href="/"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-guzzo-orange"
      >
        <Store className="h-5 w-5" />
        Ver la tienda
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-red-400"
      >
        <LogOut className="h-5 w-5" />
        Cerrar sesion
      </button>
    </div>
  );

  return (
    <>
      {/* Sidebar de escritorio */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-guzzo-black p-4 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
          <GuzzoLogo className="text-2xl" />
          <span className="rounded bg-guzzo-orange/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-guzzo-orange">
            Admin
          </span>
        </Link>
        {navItems}
        {footerLinks}
      </aside>

      {/* Barra superior (movil) */}
      <div className="flex items-center justify-between border-b border-white/10 bg-guzzo-black p-4 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <GuzzoLogo className="text-xl" />
          <span className="rounded bg-guzzo-orange/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-guzzo-orange">
            Admin
          </span>
        </Link>
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-white/70 hover:text-guzzo-orange"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Panel deslizable (movil) */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-guzzo-black p-4 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between px-2">
                <GuzzoLogo className="text-2xl" />
                <button
                  type="button"
                  aria-label="Cerrar menu"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-white/70 hover:text-guzzo-orange"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {navItems}
              {footerLinks}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
