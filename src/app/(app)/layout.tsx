import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/**
 * Layout de las paginas del cliente (menu, carrito, perfil...).
 * Incluye el navbar y el footer. Las paginas de auth NO lo usan.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar profile={profile} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
