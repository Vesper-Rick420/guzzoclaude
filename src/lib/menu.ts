import { createClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/types/db";

/** Carga los productos activos y las categorias del menu. */
export async function getMenu() {
  const supabase = await createClient();

  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    supabase.from("categories").select("*").order("name"),
  ]);

  return {
    products: (productsRes.data ?? []) as Product[],
    categories: (categoriesRes.data ?? []) as Category[],
  };
}
