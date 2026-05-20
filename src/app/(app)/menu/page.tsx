import type { Metadata } from "next";
import { getMenu } from "@/lib/menu";
import { MenuView } from "@/components/menu-view";

export const metadata: Metadata = {
  title: "Menú | GUZZO",
};

export default async function MenuPage() {
  const { products, categories } = await getMenu();
  return (
    <MenuView products={products} categories={categories} activeSlug={null} />
  );
}
