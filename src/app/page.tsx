import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GuzzoLogo } from "@/components/guzzo-logo";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { full_name: string; role: string } | null = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden bg-guzzo-black px-6 text-center">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-guzzo-orange/15 blur-[120px]" />

      <span className="relative text-sm font-medium uppercase tracking-[0.3em] text-guzzo-orange">
        Menu Digital
      </span>
      <GuzzoLogo className="relative text-7xl sm:text-8xl" />

      {user ? (
        <div className="relative flex flex-col items-center gap-3">
          <p className="text-lg text-white/80">
            Hola,{" "}
            <strong className="text-guzzo-white">
              {profile?.full_name || "cliente"}
            </strong>
          </p>
          <span className="rounded-full border border-guzzo-orange/30 bg-guzzo-orange/10 px-3 py-1 text-xs uppercase tracking-wide text-guzzo-orange">
            {profile?.role === "admin" ? "Administrador" : "Cliente"}
          </span>
          <p className="max-w-sm text-sm text-white/40">
            El menu completo llega en la Fase 5. Por ahora, tu sesion ya
            funciona.
          </p>
          <LogoutButton />
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-4">
          <p className="max-w-md text-lg text-white/60">
            Date el gusto. Inicia sesion para ver el menu.
          </p>
          <Link href="/login">
            <Button>Iniciar sesion</Button>
          </Link>
        </div>
      )}
    </main>
  );
}
