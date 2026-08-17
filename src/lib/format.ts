/** "3 publicaciones", "1 publicación" o "Sin publicaciones". */
export function countLabel(total: number): string {
  if (total === 0) return "Sin publicaciones";
  return `${total} ${total === 1 ? "publicación" : "publicaciones"}`;
}

/** Numero de lamina con dos cifras: 1 -> "01". */
export function sheetNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
