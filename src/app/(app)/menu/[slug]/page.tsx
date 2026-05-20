import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMenu } from "@/lib/menu";
import { MenuView } from "@/components/menu-view";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.charAt(0).toUpperCase() + slug.slice(1);
  return { title: `${name} | GUZZO` };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const { products, categories } = await getMenu();

  // Slug invalido -> pagina 404.
  if (!categories.some((c) => c.slug === slug)) {
    notFound();
  }

  return (
    <MenuView products={products} categories={categories} activeSlug={slug} />
  );
}
