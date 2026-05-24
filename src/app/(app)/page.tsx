import Link from "next/link";
import {
  CupSoda,
  Hamburger,
  Popcorn,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import type { Product, Category } from "@/types/db";

const categoryIcons: Record<string, LucideIcon> = {
  hamburguesas: Hamburger,
  combos: ShoppingBag,
  gaseosas: CupSoda,
  extras: Popcorn,
};

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
            const Icon = categoryIcons[cat.slug] ?? UtensilsCrossed;
            return (
              <Link
                key={cat.id}
                href={`/menu/${cat.slug}`}
                className="group relative flex h-44 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 text-center transition-all hover:border-guzzo-orange/40"
              >
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-guzzo-orange/10 blur-2xl transition-all group-hover:bg-guzzo-orange/25" />
                <Icon
                  aria-hidden
                  className="relative h-14 w-14 text-guzzo-orange transition-transform group-hover:scale-110"
                  strokeWidth={1.5}
                />
                <h3 className="relative mt-3 font-heading text-2xl font-black text-guzzo-white">
                  {cat.name}
                </h3>
                <span className="relative mt-1 text-sm text-white/40">
                  {count} {count === 1 ? "producto" : "productos"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
