import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Nueva contrasena | GUZZO",
};

export default async function ActualizarPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
      <h1 className="text-2xl font-black text-guzzo-white">Nueva contrasena</h1>

      {user ? (
        <>
          <p className="mb-6 mt-1 text-sm text-white/50">
            Escribe tu nueva contrasena para tu cuenta.
          </p>
          <UpdatePasswordForm />
        </>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-white/60">
            El enlace es invalido o ya expiro. Solicita uno nuevo.
          </p>
          <Link
            href="/recuperar"
            className="font-semibold text-guzzo-orange hover:underline"
          >
            Recuperar contrasena
          </Link>
        </div>
      )}
    </div>
  );
}
