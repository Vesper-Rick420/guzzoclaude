import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesion | GUZZO",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
      <h1 className="text-2xl font-black text-guzzo-white">Iniciar sesion</h1>
      <p className="mb-6 mt-1 text-sm text-white/50">
        Bienvenido de nuevo. Ingresa a tu cuenta.
      </p>
      <LoginForm />
    </div>
  );
}
