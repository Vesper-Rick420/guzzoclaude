"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RecuperarForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();

    if (!email) {
      toast.error("Ingresa tu correo.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/actualizar-password`,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Te enviamos un correo de recuperacion.");
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-white/70">
          Revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el
          enlace para crear una nueva contrasena.
        </p>
        <Link
          href="/login"
          className="font-semibold text-guzzo-orange hover:underline"
        >
          Volver al inicio de sesion
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="Correo electronico"
        name="email"
        type="email"
        placeholder="tucorreo@ejemplo.com"
        autoComplete="email"
      />
      <Button type="submit" disabled={loading} className="mt-1 w-full">
        {loading ? "Enviando..." : "Enviar enlace de recuperacion"}
      </Button>
      <p className="text-center text-sm text-white/50">
        <Link
          href="/login"
          className="font-semibold text-guzzo-orange hover:underline"
        >
          Volver al inicio de sesion
        </Link>
      </p>
    </form>
  );
}
