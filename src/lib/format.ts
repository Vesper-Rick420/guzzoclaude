/** Formatea un numero como precio: 5.9 -> "$5.90" */
export function formatPrice(value: number): string {
  return `$${Number(value).toFixed(2)}`;
}
