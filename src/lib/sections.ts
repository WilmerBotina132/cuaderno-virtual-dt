/**
 * Mapa de navegacion del sitio publico.
 *
 * Las dos secciones y sus sub-paginas son fijas (las define la materia), asi que
 * viven en codigo y no en la base de datos. Lo que si es dinamico son las
 * publicaciones que se cuelgan de cada una desde el panel de administracion.
 *
 * Este archivo es la unica fuente de verdad para: rutas, nombres visibles,
 * y la correspondencia entre un slug de la URL y el valor guardado en Postgres.
 */

/** Valores del enum `Section` de Prisma, como union de strings. */
export type SectionKey = "DISENO_APLICADO" | "FUNDAMENTACION_TECNOLOGICA";

/** Valores del enum `Subsection` de Prisma, como union de strings. */
export type SubsectionKey = "VIDEOS" | "CONSULTAS" | "PLANOS";

export type SubsectionSlug = "videos" | "consultas" | "planos";

export type SectionSlug = "diseno-aplicado" | "fundamentacion-tecnologica";

/** Un tema dentro de la sub-pagina de Planos (una lamina). */
export interface Topic {
  slug: string;
  name: string;
}

export interface SubsectionDef {
  slug: SubsectionSlug;
  key: SubsectionKey;
  name: string;
  /** Frase corta que se muestra bajo el nombre en las tarjetas. */
  blurb: string;
}

export interface SectionDef {
  slug: SectionSlug;
  key: SectionKey;
  name: string;
  /** Nombre corto para el cajetin y las migas de pan. */
  shortName: string;
  blurb: string;
  /** Color de identidad de la seccion (se inyecta como variable CSS). */
  accent: string;
  accentSoft: string;
  /** Orden en que se muestran las sub-paginas dentro de esta seccion. */
  subsections: SubsectionDef[];
  /** Laminas listadas dentro de la sub-pagina de Planos. */
  topics: Topic[];
}

const VIDEOS: SubsectionDef = {
  slug: "videos",
  key: "VIDEOS",
  name: "Videos de apoyo",
  blurb: "Material audiovisual para repasar los procedimientos paso a paso.",
};

const CONSULTAS: SubsectionDef = {
  slug: "consultas",
  key: "CONSULTAS",
  name: "Consultas",
  blurb: "Investigaciones y respuestas a los temas propuestos en clase.",
};

const PLANOS: SubsectionDef = {
  slug: "planos",
  key: "PLANOS",
  name: "Planos",
  blurb: "Láminas dibujadas durante el periodo, una por cada ejercicio.",
};

export const SECTIONS: Record<SectionSlug, SectionDef> = {
  "diseno-aplicado": {
    slug: "diseno-aplicado",
    key: "DISENO_APLICADO",
    name: "Diseño Aplicado",
    shortName: "Diseño Aplicado",
    blurb:
      "El taller: piezas, proyectos y perspectivas llevados del boceto a la lámina terminada.",
    accent: "#c8590c",
    accentSoft: "rgba(200, 89, 12, 0.12)",
    subsections: [VIDEOS, CONSULTAS, PLANOS],
    topics: [
      { slug: "planos", name: "Planos" },
      { slug: "tornillo", name: "Tornillo" },
      { slug: "proyecto-1", name: "Proyecto N°1" },
      { slug: "proyecto-2", name: "Proyecto N°2" },
      { slug: "tornillo-en-perspectiva", name: "Tornillo en perspectiva" },
    ],
  },
  "fundamentacion-tecnologica": {
    slug: "fundamentacion-tecnologica",
    key: "FUNDAMENTACION_TECNOLOGICA",
    name: "Fundamentación Tecnológica",
    shortName: "Fundamentación",
    blurb:
      "La teoría: normas, trazados y fundamentos que sostienen cada decisión del dibujo.",
    accent: "#1d5b80",
    accentSoft: "rgba(29, 91, 128, 0.12)",
    subsections: [PLANOS, VIDEOS, CONSULTAS],
    topics: [
      { slug: "planos", name: "Planos" },
      { slug: "tornillo", name: "Tornillo" },
      { slug: "proyecto", name: "Proyecto" },
      { slug: "carpeta", name: "Carpeta" },
      { slug: "proyecto-2", name: "Proyecto N°2" },
      { slug: "caldereria", name: "Calderería" },
    ],
  },
};

/** Lista ordenada de secciones, para menus y `generateStaticParams`. */
export const SECTION_LIST: SectionDef[] = [
  SECTIONS["diseno-aplicado"],
  SECTIONS["fundamentacion-tecnologica"],
];

export const SUBSECTIONS: Record<SubsectionSlug, SubsectionDef> = {
  videos: VIDEOS,
  consultas: CONSULTAS,
  planos: PLANOS,
};

export const SUBSECTION_LIST: SubsectionDef[] = [VIDEOS, CONSULTAS, PLANOS];

/** Devuelve la seccion si el slug de la URL es valido; si no, `undefined`. */
export function getSection(slug: string): SectionDef | undefined {
  return SECTIONS[slug as SectionSlug];
}

/** Devuelve la sub-seccion si el slug de la URL es valido; si no, `undefined`. */
export function getSubsection(slug: string): SubsectionDef | undefined {
  return SUBSECTIONS[slug as SubsectionSlug];
}

/** Devuelve la lamina pedida dentro de la sub-pagina de Planos de una seccion. */
export function getTopic(section: SectionDef, slug: string): Topic | undefined {
  return section.topics.find((t) => t.slug === slug);
}

/** Busca una seccion por el valor guardado en la base de datos. */
export function sectionByKey(key: SectionKey): SectionDef {
  return SECTION_LIST.find((s) => s.key === key) ?? SECTION_LIST[0];
}

/** Busca una sub-seccion por el valor guardado en la base de datos. */
export function subsectionByKey(key: SubsectionKey): SubsectionDef {
  return SUBSECTION_LIST.find((s) => s.key === key) ?? SUBSECTION_LIST[0];
}

/** Ruta publica de una sub-pagina. */
export function subsectionHref(
  section: SectionDef,
  subsection: SubsectionDef,
): string {
  return `/${section.slug}/${subsection.slug}`;
}

/** Ruta publica de una lamina concreta dentro de Planos. */
export function topicHref(section: SectionDef, topic: Topic): string {
  return `/${section.slug}/planos/${topic.slug}`;
}

/**
 * Donde queda visible una publicacion en el sitio publico, a partir de los
 * valores guardados en la base de datos. Lo usa el panel para el enlace "Ver".
 */
export function postHref(
  section: SectionKey,
  subsection: SubsectionKey,
  topic: string | null,
): string {
  const def = sectionByKey(section);
  if (subsection === "PLANOS") {
    return topic ? `/${def.slug}/planos/${topic}` : `/${def.slug}/planos`;
  }
  return `/${def.slug}/${subsectionByKey(subsection).slug}`;
}
