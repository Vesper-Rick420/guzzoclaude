import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UserManager } from "@/components/admin/user-manager";
import type { AdminUser } from "@/types/db";

export const metadata: Metadata = {
  title: "Usuarios | Admin GUZZO",
};

export default async function AdminUsuariosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("users")
    .select("id, full_name, email, phone, cedula, role, is_blocked, created_at")
    .order("created_at", { ascending: false });

  return (
    <UserManager
      users={(data ?? []) as AdminUser[]}
      currentUserId={user?.id ?? ""}
    />
  );
}
