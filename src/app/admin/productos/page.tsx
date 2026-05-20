import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProductManager } from "@/components/admin/product-manager";
import type { Product, Category } from "@/types/db";

export const metadata: Metadata = {
  title: "Productos | Admin GUZZO",
};

export default async function AdminProductosPage() {
  const supabase = await createClient();

  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ]);

  return (
    <ProductManager
      products={(productsRes.data ?? []) as Product[]}
      categories={(categoriesRes.data ?? []) as Category[]}
    />
  );
}
