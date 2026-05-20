import type { Metadata } from "next";
import { RecuperarForm } from "@/components/auth/recuperar-form";

export const metadata: Metadata = {
  title: "Recuperar contrasena | GUZZO",
};

export default function RecuperarPage() {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
      <h1 className="text-2xl font-black text-guzzo-white">
        Recuperar contrasena
      </h1>
      <p className="mb-6 mt-1 text-sm text-white/50">
        Te enviaremos un enlace a tu correo para crear una nueva.
      </p>
      <RecuperarForm />
    </div>
  );
}
