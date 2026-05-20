import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la clave SECRETA (service role).
 * Salta las politicas RLS, asi que SOLO debe usarse en el servidor
 * (Server Actions). Nunca debe importarse en componentes del navegador.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
