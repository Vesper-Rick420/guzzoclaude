import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn: combina clases de Tailwind de forma segura.
 * clsx -> arma la lista de clases (condicionales incluidas)
 * twMerge -> resuelve conflictos (ej: "px-2 px-4" => "px-4")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
