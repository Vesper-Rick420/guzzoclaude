import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Ruta a la que Supabase redirige tras hacer clic en el enlace del correo
 * (recuperar contrasena, confirmar cuenta). Canjea el codigo por una sesion.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Codigo ausente o invalido.
  return NextResponse.redirect(`${origin}/login?error=enlace_invalido`);
}
