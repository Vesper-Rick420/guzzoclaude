import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Crear cuenta | GUZZO",
};

export default async function RegistroPage() {
  // Si ya hay sesion, no tiene sentido mostrar el registro.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
      <h1 className="text-2xl font-black text-guzzo-white">Crear cuenta</h1>
      <p className="mb-6 mt-1 text-sm text-white/50">
        Registrate para empezar a pedir y date el gusto.
      </p>
      <RegisterForm />
    </div>
  );
}
