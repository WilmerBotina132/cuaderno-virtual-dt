import { countLabel } from "@/lib/format";
import { listPosts } from "@/lib/posts";
import type { SectionDef, SubsectionDef, Topic } from "@/lib/sections";

import EmptyState from "./EmptyState";
import PageHeader, { type Crumb } from "./PageHeader";
import PostList from "./PostList";

/**
 * Cuerpo compartido por todas las sub-paginas que listan publicaciones:
 * Videos de apoyo, Consultas y cada lamina dentro de Planos.
 * Lo unico que cambia entre ellas es el filtro y los textos de la cabecera.
 */
export default async function SubsectionPage({
  section,
  subsection,
  topic,
}: {
  section: SectionDef;
  subsection: SubsectionDef;
  /** Solo se pasa cuando la pagina es una lamina concreta de Planos. */
  topic?: Topic;
}) {
  const posts = await listPosts({
    section: section.key,
    subsection: subsection.key,
    topic: topic?.slug,
  });

  const trail: Crumb[] = [
    { href: "/home", label: "Inicio" },
    { href: `/${section.slug}`, label: section.name },
  ];
  if (topic) {
    trail.push({ href: `/${section.slug}/planos`, label: subsection.name });
  }

  return (
    <div className="contenedor">
      <PageHeader
        trail={trail}
        eyebrow={topic ? `${section.name} · ${subsection.name}` : section.name}
        title={topic ? topic.name : subsection.name}
        description={topic ? undefined : subsection.blurb}
        meta={countLabel(posts.length)}
      />

      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <EmptyState
          message={
            topic
              ? `La lámina "${topic.name}" todavía no tiene material publicado. Vuelve más adelante.`
              : `Todavía no hay publicaciones en ${subsection.name.toLowerCase()} de ${section.name}. Vuelve más adelante.`
          }
        />
      )}
    </div>
  );
}
