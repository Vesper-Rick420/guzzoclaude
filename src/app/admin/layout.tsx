import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

/**
 * Layout del panel admin. Verifica en el servidor que el usuario
 * sea administrador; si no, lo manda al inicio.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen flex-col bg-guzzo-black lg:flex-row">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
