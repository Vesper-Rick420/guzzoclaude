import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import type { Product, Category } from "@/types/db";

export default async function Home() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const allProducts = (products ?? []) as Product[];
  const allCategories = (categories ?? []) as Category[];
  const featured = allProducts.filter((p) => p.is_featured);

  return (
    <>
      <Hero />

      {/* Mas vendidos */}
      <section
        id="mas-vendidos"
        className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6"
      >
        <div className="mb-8">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-guzzo-orange">
            Los favoritos
          </span>
          <h2 className="font-heading text-3xl font-black text-guzzo-white sm:text-4xl">
            Más vendidos
          </h2>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-white/40">Aún no hay productos destacados.</p>
        )}
      </section>

      {/* Categorias */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-guzzo-orange">
            El menú
          </span>
          <h2 className="font-heading text-3xl font-black text-guzzo-white sm:text-4xl">
            Explora por categoría
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {allCategories.map((cat) => {
            const count = allProducts.filter(
              (p) => p.category_id === cat.id,
            ).length;
            return (
              <Link
                key={cat.id}
                href={`/menu/${cat.slug}`}
                className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 transition-all hover:border-guzzo-orange/40"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-guzzo-orange/10 blur-2xl transition-all group-hover:bg-guzzo-orange/25" />
                <h3 className="font-heading text-2xl font-black text-guzzo-white">
                  {cat.name}
                </h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm text-white/40">
                    {count} {count === 1 ? "producto" : "productos"}
                  </span>
                  <ArrowRight className="h-5 w-5 text-guzzo-orange transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
