"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("full_name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const cedula = String(fd.get("cedula") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirm") ?? "");

    if (!fullName || !email || !phone || !cedula || !password) {
      toast.error("Completa todos los campos.");
      return;
    }
    if (password.length < 8) {
      toast.error("La contrasena debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("Las contrasenas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, cedula },
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    // Si la confirmacion por correo esta activa, no habra sesion todavia.
    if (!data.session) {
      toast.success("Cuenta creada. Revisa tu correo para confirmarla.");
      router.push("/login");
      return;
    }
    toast.success("Cuenta creada. Bienvenido a GUZZO.");
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="Nombre completo"
        name="full_name"
        placeholder="Tu nombre"
        autoComplete="name"
      />
      <Field
        label="Correo electronico"
        name="email"
        type="email"
        placeholder="tucorreo@ejemplo.com"
        autoComplete="email"
      />
      <Field
        label="Telefono"
        name="phone"
        type="tel"
        placeholder="0999999999"
        autoComplete="tel"
      />
      <Field
        label="Cedula"
        name="cedula"
        placeholder="Tu numero de cedula"
        inputMode="numeric"
      />
      <Field
        label="Contrasena"
        name="password"
        type="password"
        placeholder="Minimo 8 caracteres"
        autoComplete="new-password"
      />
      <Field
        label="Confirmar contrasena"
        name="confirm"
        type="password"
        placeholder="Repite tu contrasena"
        autoComplete="new-password"
      />
      <Button type="submit" disabled={loading} className="mt-2 w-full">
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
      <p className="text-center text-sm text-white/50">
        Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-guzzo-orange hover:underline"
        >
          Inicia sesion
        </Link>
      </p>
    </form>
  );
}
