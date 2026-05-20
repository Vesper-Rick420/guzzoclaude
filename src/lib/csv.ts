import Papa from "papaparse";

/**
 * Genera un archivo CSV a partir de filas (objetos) y lo descarga.
 * El prefijo BOM (﻿) hace que Excel lea bien los acentos.
 */
export function downloadCsv(
  filename: string,
  rows: Record<string, unknown>[],
) {
  const csv = Papa.unparse(rows);
  const blob = new Blob(["﻿" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
