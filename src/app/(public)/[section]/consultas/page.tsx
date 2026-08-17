import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SubsectionPage from "@/components/SubsectionPage";
import { getSection, SUBSECTIONS } from "@/lib/sections";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) return {};
  return {
    title: `${SUBSECTIONS.consultas.name} · ${section.name}`,
    description: SUBSECTIONS.consultas.blurb,
  };
}

export default async function ConsultasPage({ params }: Params) {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  return <SubsectionPage section={section} subsection={SUBSECTIONS.consultas} />;
}
