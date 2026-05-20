import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para el SERVIDOR (Server Components, Server Actions,
 * Route Handlers). Lee la sesion desde las cookies de la peticion.
 * En Next.js 16 cookies() es asincrono, por eso usamos await.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde un Server Component: la renovacion de la
            // sesion la hara el proxy (se configura en la Fase 3).
          }
        },
      },
    },
  );
}
