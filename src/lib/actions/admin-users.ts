"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Result = { ok: true } | { error: string };

/**
 * Elimina un usuario por completo (de Auth y, en cascada, su perfil).
 * Solo un administrador puede ejecutarla.
 */
export async function deleteUser(userId: string): Promise<Result> {
  const supabase = await createClient();

  // 1. Verificar que quien llama esta autenticado y es admin.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado." };

  const { data: me } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return { error: "No autorizado." };

  // 2. Un admin no puede eliminar su propia cuenta.
  if (userId === user.id) {
    return { error: "No puedes eliminar tu propia cuenta." };
  }

  // 3. Eliminar con la clave secreta (borra de auth.users -> cascada).
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: "No se pudo eliminar el usuario." };

  return { ok: true };
}
