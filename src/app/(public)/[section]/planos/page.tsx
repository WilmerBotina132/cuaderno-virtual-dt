import type { Metadata } from "next";
import { notFound } from "next/navigation";

import DimensionLine from "@/components/DimensionLine";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import TopicList from "@/components/TopicList";
import { countByTopic } from "@/lib/posts";
import { getSection, SUBSECTIONS } from "@/lib/sections";

import styles from "./page.module.scss";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) return {};
  return {
    title: `${SUBSECTIONS.planos.name} · ${section.name}`,
    description: SUBSECTIONS.planos.blurb,
  };
}

/**
 * Indice de laminas de una seccion.
 *
 * Las dos secciones tienen su propia ruta (/diseno-aplicado/planos y
 * /fundamentacion-tecnologica/planos) pero comparten este archivo y el
 * componente TopicList: lo unico que cambia es la lista de temas.
 */
export default async function PlanosPage({ params }: Params) {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  const counts = await countByTopic(section.key);
  const total = section.topics.length;

  return (
    <div className="contenedor">
      <PageHeader
        trail={[
          { href: "/home", label: "Inicio" },
          { href: `/${section.slug}`, label: section.name },
        ]}
        eyebrow={section.name}
        title={SUBSECTIONS.planos.name}
        description={SUBSECTIONS.planos.blurb}
      />

      {/* La cota mide el contenido: cuantas laminas componen este juego. */}
      <DimensionLine label={`${total} ${total === 1 ? "lámina" : "láminas"}`} />

      <Reveal className={styles.list}>
        <TopicList section={section} counts={counts} />
      </Reveal>
    </div>
  );
}
