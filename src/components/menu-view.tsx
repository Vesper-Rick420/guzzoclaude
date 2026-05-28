"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product, Category } from "@/types/db";

type SortOption = "destacados" | "precio-asc" | "precio-desc" | "nombre";

type Props = {
  products: Product[];
  categories: Category[];
  activeSlug: string | null;
};

export function MenuView({ products, categories, activeSlug }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("destacados");

  const activeCategory =
    activeSlug != null
      ? (categories.find((c) => c.slug === activeSlug) ?? null)
      : null;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list: Product[];
    if (q) {
      // Con busqueda activa: se busca en TODO el menu.
      list = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q),
      );
    } else if (activeCategory) {
      list = products.filter((p) => p.category_id === activeCategory.id);
    } else {
      list = products;
    }

    const sorted = [...list];
    if (sort === "precio-asc") {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "precio-desc") {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "nombre") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }
    return sorted;
  }, [products, query, sort, activeCategory]);

  const searching = query.trim().length > 0;
  const heading = searching
    ? "Resultados de búsqueda"
    : activeCategory
      ? activeCategory.name
      : "Todo el menú";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-black text-guzzo-white sm:text-4xl">
        {heading}
      </h1>

      {/* Pestanas de categoria */}
      <div className="mt-6 flex flex-wrap gap-2">
        <CategoryTab
          href="/menu"
          label="Todos"
          active={activeSlug == null && !searching}
        />
        {categories.map((c) => (
          <CategoryTab
            key={c.id}
            href={`/menu/${c.slug}`}
            label={c.name}
            active={activeSlug === c.slug && !searching}
          />
        ))}
      </div>

      {/* Buscador + orden */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 text-guzzo-white outline-none transition-all placeholder:text-white/30 focus:border-guzzo-orange focus:ring-2 focus:ring-guzzo-orange/30"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-guzzo-white outline-none focus:border-guzzo-orange"
        >
          <option value="destacados">Destacados</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre: A-Z</option>
        </select>
      </div>

      {/* Resultados */}
      {visible.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              categorySlug={
                categories.find((c) => c.id === p.category_id)?.slug ?? null
              }
            />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-white/50">
          No encontramos productos
          {searching ? ` para "${query.trim()}"` : ""}.
        </p>
      )}
    </div>
  );
}

function CategoryTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-gradient-to-r from-guzzo-orange to-guzzo-orange-burnt px-4 py-2 text-sm font-semibold text-guzzo-black"
          : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:border-guzzo-orange/40 hover:text-guzzo-orange"
      }
    >
      {label}
    </Link>
  );
}
