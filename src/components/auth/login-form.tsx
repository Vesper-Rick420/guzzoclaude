"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    if (!email || !password) {
      toast.error("Ingresa tu correo y contrasena.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      const msg = error.message?.toLowerCase() ?? "";
      if (msg.includes("invalid login credentials")) {
        toast.error("Correo o contrasena incorrectos.");
      } else if (msg.includes("email not confirmed")) {
        toast.error("Confirma tu correo antes de iniciar sesion.");
      } else {
        toast.error(error.message || "No se pudo iniciar sesion.");
      }
      return;
    }

    // Si el admin bloqueo la cuenta, cerramos la sesion al instante.
    const { data: profile } = await supabase
      .from("users")
      .select("is_blocked")
      .eq("id", data.user.id)
      .single();

    if (profile?.is_blocked) {
      await supabase.auth.signOut();
      setLoading(false);
      toast.error("Tu cuenta esta bloqueada. Contacta al administrador.");
      return;
    }

    setLoading(false);
    toast.success("Bienvenido de nuevo.");
    router.push("/");
    router.refresh();
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
      <Field
        label="Contrasena"
        name="password"
        type="password"
        placeholder="Tu contrasena"
        autoComplete="current-password"
      />
      <Link
        href="/recuperar"
        className="-mt-1 text-right text-sm text-white/50 hover:text-guzzo-orange"
      >
        Olvidaste tu contrasena?
      </Link>
      <Button type="submit" disabled={loading} className="mt-1 w-full">
        {loading ? "Ingresando..." : "Iniciar sesion"}
      </Button>
      <p className="text-center text-sm text-white/50">
        No tienes cuenta?{" "}
        <Link
          href="/registro"
          className="font-semibold text-guzzo-orange hover:underline"
        >
          Registrate
        </Link>
      </p>
    </form>
  );
}
