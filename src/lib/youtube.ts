/**
 * Utilidades para convertir un enlace de YouTube pegado por el administrador
 * en algo que se pueda incrustar en la pagina.
 *
 * Acepta las formas habituales:
 *   https://www.youtube.com/watch?v=ID
 *   https://youtu.be/ID
 *   https://www.youtube.com/embed/ID
 *   https://www.youtube.com/shorts/ID
 *   https://www.youtube.com/live/ID
 */

const ID_PATTERN = /^[\w-]{11}$/;

/** Extrae el identificador del video, o `null` si el enlace no es de YouTube. */
export function youtubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  // Permitir que se pegue directamente el ID.
  if (ID_PATTERN.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return ID_PATTERN.test(id) ? id : null;
  }

  if (host !== "youtube.com" && host !== "m.youtube.com" && host !== "youtube-nocookie.com") {
    return null;
  }

  const fromQuery = url.searchParams.get("v");
  if (fromQuery && ID_PATTERN.test(fromQuery)) return fromQuery;

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length >= 2 && ["embed", "shorts", "live", "v"].includes(segments[0])) {
    return ID_PATTERN.test(segments[1]) ? segments[1] : null;
  }

  return null;
}

/** `true` si el texto es un enlace de YouTube reconocible. */
export function isYoutubeUrl(input: string): boolean {
  return youtubeId(input) !== null;
}

/** URL lista para usar en un `<iframe>`. */
export function youtubeEmbedUrl(input: string): string | null {
  const id = youtubeId(input);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

/** Miniatura del video, para usarla como portada. */
export function youtubeThumbnail(input: string): string | null {
  const id = youtubeId(input);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
