/** Formatea un numero como precio: 5.9 -> "$5.90" */
export function formatPrice(value: number): string {
  return `$${Number(value).toFixed(2)}`;
}

/** Formatea una fecha ISO: "2026-05-19..." -> "19 may 2026" */
export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
