"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Ban, CircleCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { deleteUser } from "@/lib/actions/admin-users";
import { downloadCsv } from "@/lib/csv";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/db";

type Filter = "todos" | "activos" | "bloqueados";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "activos", label: "Activos" },
  { value: "bloqueados", label: "Bloqueados" },
];

export function UserManager({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const visible = users.filter((u) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.cedula ?? "").toLowerCase().includes(q);
    const matchesFilter =
      filter === "todos" ||
      (filter === "activos" && !u.is_blocked) ||
      (filter === "bloqueados" && u.is_blocked);
    return matchesQuery && matchesFilter;
  });

  async function toggleBlock(u: AdminUser) {
    setBusyId(u.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({ is_blocked: !u.is_blocked })
      .eq("id", u.id);
    setBusyId(null);
    if (error) {
      toast.error("No se pudo actualizar el usuario.");
      return;
    }
    toast.success(
      u.is_blocked ? "Usuario desbloqueado." : "Usuario bloqueado.",
    );
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const result = await deleteUser(id);
    setBusyId(null);
    setDeletingId(null);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Usuario eliminado.");
    router.refresh();
  }

  function handleExport() {
    if (visible.length === 0) {
      toast.error("No hay usuarios para exportar.");
      return;
    }
    const rows = visible.map((u) => ({
      Nombre: u.full_name,
      Correo: u.email,
      Telefono: u.phone ?? "",
      Cedula: u.cedula ?? "",
      Rol: u.role === "admin" ? "Administrador" : "Cliente",
      Estado: u.is_blocked ? "Bloqueado" : "Activo",
      Registrado: formatDate(u.created_at),
    }));
    downloadCsv("usuarios-guzzo.csv", rows);
    toast.success("CSV descargado.");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-black text-guzzo-white sm:text-3xl">
            Usuarios
          </h1>
          <p className="text-sm text-white/40">
            {users.length} usuario{users.length === 1 ? "" : "s"} registrado
            {users.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-4 py-2.5 text-sm font-semibold text-guzzo-black transition-all hover:brightness-110 active:scale-95"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      {/* Busqueda + filtros */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, correo o cédula..."
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 text-guzzo-white outline-none transition-all placeholder:text-white/30 focus:border-guzzo-orange focus:ring-2 focus:ring-guzzo-orange/30"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === f.value
                  ? "bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt text-guzzo-black"
                  : "border border-white/10 bg-white/5 text-white/70 hover:text-guzzo-orange",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="mt-6 flex flex-col gap-2">
        {visible.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/40">
            No se encontraron usuarios.
          </p>
        )}

        {visible.map((u) => {
          const isSelf = u.id === currentUserId;
          return (
            <div
              key={u.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-guzzo-orange to-guzzo-orange-burnt font-bold text-guzzo-black">
                {(u.full_name || "U").charAt(0).toUpperCase()}
              </span>

              <div className="min-w-[160px] flex-1">
                <p className="font-heading font-bold text-guzzo-white">
                  {u.full_name}
                  {isSelf && (
                    <span className="ml-2 text-xs font-normal text-guzzo-orange">
                      (tú)
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-white/40">{u.email}</p>
              </div>

              <div className="hidden text-xs text-white/40 sm:block">
                <p>{u.phone || "—"}</p>
                <p>CI: {u.cedula || "—"}</p>
              </div>

              {u.role === "admin" && (
                <span className="rounded-full border border-guzzo-orange/30 bg-guzzo-orange/10 px-2.5 py-1 text-xs font-semibold text-guzzo-orange">
                  Admin
                </span>
              )}
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-semibold",
                  u.is_blocked
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-green-500/30 bg-green-500/10 text-green-400",
                )}
              >
                {u.is_blocked ? "Bloqueado" : "Activo"}
              </span>

              {!isSelf && (
                <div className="flex items-center gap-1">
                  {deletingId === u.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDelete(u.id)}
                        disabled={busyId === u.id}
                        className="rounded-lg bg-red-500/20 px-2.5 py-1.5 text-xs font-semibold text-red-400 disabled:opacity-50"
                      >
                        {busyId === u.id ? "..." : "Eliminar"}
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
                        onClick={() => toggleBlock(u)}
                        disabled={busyId === u.id}
                        aria-label={u.is_blocked ? "Desbloquear" : "Bloquear"}
                        className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-guzzo-orange disabled:opacity-50"
                      >
                        {u.is_blocked ? (
                          <CircleCheck className="h-4 w-4" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(u.id)}
                        aria-label="Eliminar"
                        className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
