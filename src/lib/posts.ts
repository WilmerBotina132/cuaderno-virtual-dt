import "server-only";

import type { MediaItem, Post } from "@prisma/client";

import { prisma } from "./prisma";
import type { SectionKey, SubsectionKey } from "./sections";

export type PostWithMedia = Post & { media: MediaItem[] };

/**
 * Ejecuta una consulta y, si la base de datos no responde, devuelve un valor
 * de respaldo en vez de tumbar la pagina.
 *
 * Esto permite que el sitio compile y se pueda ver en local ANTES de haber
 * creado la base de datos en Neon: las secciones simplemente aparecen vacias.
 */
async function safeQuery<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`[db] Falló la consulta "${label}":`, error);
    return fallback;
  }
}

const withMedia = {
  media: { orderBy: { position: "asc" } },
} as const;

interface ListFilter {
  section: SectionKey;
  subsection: SubsectionKey;
  /** Solo aplica a la sub-seccion PLANOS. */
  topic?: string;
}

/** Publicaciones visibles de una sub-pagina concreta del sitio publico. */
export function listPosts(filter: ListFilter): Promise<PostWithMedia[]> {
  return safeQuery(
    "listPosts",
    () =>
      prisma.post.findMany({
        where: {
          published: true,
          section: filter.section,
          subsection: filter.subsection,
          ...(filter.topic ? { topic: filter.topic } : {}),
        },
        include: withMedia,
        orderBy: { publishedAt: "desc" },
      }),
    [],
  );
}

/** Una publicacion por su slug, para la vista de detalle. */
export function getPostBySlug(slug: string): Promise<PostWithMedia | null> {
  return safeQuery(
    "getPostBySlug",
    () =>
      prisma.post.findFirst({
        where: { slug, published: true },
        include: withMedia,
      }),
    null,
  );
}

/**
 * Cuantas publicaciones tiene cada sub-seccion de una seccion.
 * Se usa para mostrar el contador en las tarjetas de navegacion.
 */
export async function countBySubsection(
  section: SectionKey,
): Promise<Record<SubsectionKey, number>> {
  const empty: Record<SubsectionKey, number> = { VIDEOS: 0, CONSULTAS: 0, PLANOS: 0 };

  const rows = await safeQuery(
    "countBySubsection",
    () =>
      prisma.post.groupBy({
        by: ["subsection"],
        where: { published: true, section },
        _count: { _all: true },
      }),
    [] as { subsection: SubsectionKey; _count: { _all: number } }[],
  );

  for (const row of rows) {
    empty[row.subsection as SubsectionKey] = row._count._all;
  }
  return empty;
}

/**
 * Cuantas publicaciones tiene cada lamina dentro de la sub-pagina de Planos.
 * Devuelve un mapa `{ [slugDelTema]: cantidad }`.
 */
export async function countByTopic(section: SectionKey): Promise<Record<string, number>> {
  const rows = await safeQuery(
    "countByTopic",
    () =>
      prisma.post.groupBy({
        by: ["topic"],
        where: { published: true, section, subsection: "PLANOS" },
        _count: { _all: true },
      }),
    [] as { topic: string | null; _count: { _all: number } }[],
  );

  const counts: Record<string, number> = {};
  for (const row of rows) {
    if (row.topic) counts[row.topic] = row._count._all;
  }
  return counts;
}

/** Ultimas publicaciones de todo el cuaderno, para la portada. */
export function listRecentPosts(take = 4): Promise<PostWithMedia[]> {
  return safeQuery(
    "listRecentPosts",
    () =>
      prisma.post.findMany({
        where: { published: true },
        include: withMedia,
        orderBy: { publishedAt: "desc" },
        take,
      }),
    [],
  );
}

// --- Consultas del panel de administracion ---------------------------------
// Estas no usan `safeQuery`: si la base de datos falla, el administrador tiene
// que enterarse en vez de ver un panel vacio que parece correcto.

/** Todas las publicaciones, incluidas las ocultas. */
export function listAllPosts(): Promise<PostWithMedia[]> {
  return prisma.post.findMany({
    include: withMedia,
    orderBy: { updatedAt: "desc" },
  });
}

export function getPostById(id: string): Promise<PostWithMedia | null> {
  return prisma.post.findUnique({ where: { id }, include: withMedia });
}
