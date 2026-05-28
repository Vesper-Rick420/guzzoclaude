// Configuracion de personalizacion para hamburguesas.
// Se usa tanto en el cliente (modal de producto) como en el servidor
// (createOrder) para validar y calcular precios reales.

export const DEFAULT_BURGER_INGREDIENTS = [
  "Carne",
  "Queso cheddar",
  "Lechuga",
  "Tomate",
  "Cebolla",
  "Salsa Guzzo",
] as const;

export type BurgerExtra = {
  id: string;
  name: string;
  price: number;
};

export const BURGER_EXTRAS: BurgerExtra[] = [
  { id: "tocino", name: "Tocino", price: 1.0 },
  { id: "doble-carne", name: "Doble carne", price: 2.0 },
  { id: "queso-extra", name: "Queso extra", price: 0.5 },
  { id: "huevo", name: "Huevo", price: 0.75 },
  { id: "aros-cebolla", name: "Aros de cebolla", price: 0.75 },
];

export function getExtraById(id: string): BurgerExtra | undefined {
  return BURGER_EXTRAS.find((e) => e.id === id);
}

export function isValidIngredient(name: string): boolean {
  return (DEFAULT_BURGER_INGREDIENTS as readonly string[]).includes(name);
}

// Convierte las personalizaciones a un texto legible para el cocinero.
export function formatCustomizationNotes(opts: {
  removedIngredients: string[];
  extras: { id: string; name: string }[];
}): string | null {
  const parts: string[] = [];
  if (opts.removedIngredients.length > 0) {
    parts.push(`Sin: ${opts.removedIngredients.join(", ")}`);
  }
  if (opts.extras.length > 0) {
    parts.push(`Extras: ${opts.extras.map((e) => e.name).join(", ")}`);
  }
  return parts.length > 0 ? parts.join(". ") : null;
}
