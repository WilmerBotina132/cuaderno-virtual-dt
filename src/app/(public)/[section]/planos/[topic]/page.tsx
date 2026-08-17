import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SubsectionPage from "@/components/SubsectionPage";
import { getSection, getTopic, SUBSECTIONS } from "@/lib/sections";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ section: string; topic: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section: sectionSlug, topic: topicSlug } = await params;
  const section = getSection(sectionSlug);
  const topic = section && getTopic(section, topicSlug);
  if (!section || !topic) return {};
  return {
    title: `${topic.name} · ${SUBSECTIONS.planos.name} · ${section.name}`,
    description: `Lámina "${topic.name}" de ${section.name}.`,
  };
}

/** Una lamina concreta dentro de la sub-pagina de Planos. */
export default async function TopicPage({ params }: Params) {
  const { section: sectionSlug, topic: topicSlug } = await params;
  const section = getSection(sectionSlug);
  if (!section) notFound();

  const topic = getTopic(section, topicSlug);
  if (!topic) notFound();

  return (
    <SubsectionPage section={section} subsection={SUBSECTIONS.planos} topic={topic} />
  );
}
