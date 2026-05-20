"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu as MenuIcon,
  X,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { GuzzoLogo } from "@/components/guzzo-logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Combos", href: "/#combos" },
  { label: "Hamburguesas", href: "/#hamburguesas" },
  { label: "Gaseosas", href: "/#gaseosas" },
  { label: "Extras", href: "/#extras" },
];

type NavbarProps = {
  profile: { full_name: string; role: string } | null;
};

export function Navbar({ profile }: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Sesion cerrada.");
    router.push("/login");
    router.refresh();
  }

  const firstName = profile?.full_name?.trim().split(" ")[0] || "Cliente";
  const initial = firstName.charAt(0).toUpperCase();
  const isAdmin = profile?.role === "admin";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-guzzo-black/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="GUZZO inicio">
          <GuzzoLogo className="text-2xl" />
        </Link>

        {/* Enlaces de escritorio */}
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-guzzo-orange"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Acciones */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Buscar"
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-guzzo-orange"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            href="/carrito"
            aria-label="Carrito"
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-guzzo-orange"
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>

          {/* Menu de usuario */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition-colors hover:border-guzzo-orange/40"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-guzzo-orange to-guzzo-orange-burnt text-sm font-bold text-guzzo-black">
                {initial}
              </span>
              <span className="hidden text-sm font-medium text-white/80 sm:block">
                {firstName}
              </span>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  {/* Fondo invisible para cerrar al hacer clic fuera */}
                  <button
                    type="button"
                    aria-hidden
                    tabIndex={-1}
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-guzzo-black/95 p-1.5 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-semibold text-guzzo-white">
                        {profile?.full_name || "Cliente"}
                      </p>
                      <span className="text-xs uppercase tracking-wide text-guzzo-orange">
                        {isAdmin ? "Administrador" : "Cliente"}
                      </span>
                    </div>
                    <div className="my-1 h-px bg-white/10" />
                    <Link
                      href="/perfil"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-guzzo-orange"
                    >
                      <User className="h-4 w-4" />
                      Mi perfil
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-guzzo-orange"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Panel admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesion
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Boton hamburguesa (movil) */}
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-guzzo-orange lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Panel movil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-guzzo-black lg:hidden"
          >
            <ul className="flex flex-col gap-1 p-4">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-guzzo-orange"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
