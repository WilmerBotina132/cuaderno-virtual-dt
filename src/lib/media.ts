/**
 * Tipos de contenido que puede llevar una publicacion.
 * Este modulo no toca la base de datos, asi que tambien puede importarse
 * desde componentes de cliente (el formulario del panel).
 */

export const MEDIA_KINDS = [
  { value: "YOUTUBE", label: "Video de YouTube", hint: "Pega el enlace del video" },
  { value: "VIDEO_UPLOAD", label: "Video subido", hint: "Sube un archivo desde el computador" },
  { value: "IMAGE", label: "Foto", hint: "Sube una imagen desde el computador" },
  { value: "LINK", label: "Enlace", hint: "Cualquier dirección externa" },
] as const;

export type MediaKindValue = (typeof MEDIA_KINDS)[number]["value"];

/** Los dos tipos que implican subir un archivo a Vercel Blob. */
export type UploadKind = "IMAGE" | "VIDEO_UPLOAD";

export function isUploadKind(kind: MediaKindValue): kind is UploadKind {
  return kind === "IMAGE" || kind === "VIDEO_UPLOAD";
}

export function mediaKindLabel(kind: string): string {
  return MEDIA_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

/**
 * Tamano maximo aceptado por archivo subido.
 * Vercel Blob admite archivos mucho mayores; el tope de aqui es una decision
 * nuestra para no gastar la cuota de almacenamiento con un solo video.
 */
export const MAX_UPLOAD_BYTES: Record<UploadKind, number> = {
  IMAGE: 15 * 1024 * 1024, // 15 MB
  VIDEO_UPLOAD: 500 * 1024 * 1024, // 500 MB
};

export const ALLOWED_CONTENT_TYPES: Record<UploadKind, string[]> = {
  IMAGE: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
  VIDEO_UPLOAD: ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"],
};

/** "12,4 MB" a partir de un numero de bytes. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Dominio legible de una URL, para mostrarlo junto a los enlaces. */
export function linkHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "enlace";
  }
}
