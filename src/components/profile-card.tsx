"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { UserProfile } from "@/types/db";

export function ProfileCard({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name);
  const [phone, setPhone] = useState(profile.phone ?? "");

  async function handleSave() {
    if (!fullName.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({ full_name: fullName.trim(), phone: phone.trim() })
      .eq("id", profile.id);
    setLoading(false);
    if (error) {
      toast.error("No se pudo guardar el perfil.");
      return;
    }
    toast.success("Perfil actualizado.");
    setEditing(false);
    router.refresh();
  }

  function handleCancel() {
    setFullName(profile.full_name);
    setPhone(profile.phone ?? "");
    setEditing(false);
  }

  const initial = (profile.full_name || "U").charAt(0).toUpperCase();

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-guzzo-orange to-guzzo-orange-burnt text-2xl font-black text-guzzo-black">
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex flex-col gap-3">
              <Field
                label="Nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Field
                label="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-heading text-xl font-bold text-guzzo-white">
                  {profile.full_name}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 transition-colors hover:border-guzzo-orange/40 hover:text-guzzo-orange"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
              </div>
              <span className="text-xs uppercase tracking-wide text-guzzo-orange">
                {profile.role === "admin" ? "Administrador" : "Cliente"}
              </span>
              <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Info label="Correo" value={profile.email} />
                <Info label="Teléfono" value={profile.phone || "—"} />
                <Info label="Cédula" value={profile.cedula || "—"} />
                <Info
                  label="Miembro desde"
                  value={formatDate(profile.created_at)}
                />
              </dl>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-wide text-white/35">
        {label}
      </dt>
      <dd className="truncate text-sm text-guzzo-white">{value}</dd>
    </div>
  );
}
