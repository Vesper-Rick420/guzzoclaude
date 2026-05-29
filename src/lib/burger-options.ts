// Configuracion de personalizacion para hamburguesas y combos.
// Se usa tanto en el cliente (modal de producto) como en el servidor
// (createOrder) para validar y calcular precios reales.

export const BURGER_INGREDIENTS = [
  "Carne",
  "Queso cheddar",
  "Lechuga",
  "Tomate",
  "Cebolla",
  "Salsa Guzzo",
] as const;

export const COMBO_ITEMS = [
  "Hamburguesa",
  "Papas fritas",
  "Gaseosa",
] as const;

export type ProductExtra = {
  id: string;
  name: string;
  price: number;
};

export const PRODUCT_EXTRAS: ProductExtra[] = [
  { id: "tocino", name: "Tocino", price: 1.0 },
  { id: "doble-carne", name: "Doble carne", price: 2.0 },
  { id: "queso-extra", name: "Queso extra", price: 0.5 },
  { id: "huevo", name: "Huevo", price: 0.75 },
  { id: "aros-cebolla", name: "Aros de cebolla", price: 0.75 },
];

export type Sauce = {
  id: string;
  name: string;
};

export const SAUCES: Sauce[] = [
  { id: "guzzo", name: "Salsa Guzzo" },
  { id: "bbq", name: "BBQ" },
  { id: "mostaza", name: "Mostaza" },
  { id: "ketchup", name: "Ketchup" },
  { id: "mayonesa", name: "Mayonesa" },
  { id: "picante", name: "Picante" },
];

// Mantenemos el alias por compatibilidad con codigo previo.
export const DEFAULT_BURGER_INGREDIENTS = BURGER_INGREDIENTS;
export const BURGER_EXTRAS = PRODUCT_EXTRAS;
export type BurgerExtra = ProductExtra;

export function getExtraById(id: string): ProductExtra | undefined {
  return PRODUCT_EXTRAS.find((e) => e.id === id);
}

export function getSauceById(id: string): Sauce | undefined {
  return SAUCES.find((s) => s.id === id);
}

export function isValidIngredient(name: string): boolean {
  return (
    (BURGER_INGREDIENTS as readonly string[]).includes(name) ||
    (COMBO_ITEMS as readonly string[]).includes(name)
  );
}

export function ingredientsForCategory(
  slug: string | null | undefined,
): readonly string[] {
  if (slug === "hamburguesas") return BURGER_INGREDIENTS;
  if (slug === "combos") return COMBO_ITEMS;
  return [];
}

export function canCustomize(slug: string | null | undefined): boolean {
  return slug === "hamburguesas" || slug === "combos";
}

export function formatCustomizationNotes(opts: {
  removedIngredients: string[];
  extras: { id: string; name: string }[];
  sauces?: { id: string; name: string }[];
}): string | null {
  const parts: string[] = [];
  if (opts.removedIngredients.length > 0) {
    parts.push(`Sin: ${opts.removedIngredients.join(", ")}`);
  }
  if (opts.extras.length > 0) {
    parts.push(`Extras: ${opts.extras.map((e) => e.name).join(", ")}`);
  }
  if (opts.sauces && opts.sauces.length > 0) {
    parts.push(`Salsas: ${opts.sauces.map((s) => s.name).join(", ")}`);
  }
  return parts.length > 0 ? parts.join(". ") : null;
}
