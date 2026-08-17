import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageHeader from "@/components/PageHeader";
import SubsectionGrid from "@/components/SubsectionGrid";
import { countBySubsection } from "@/lib/posts";
import { getSection } from "@/lib/sections";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) return {};
  return { title: section.name, description: section.blurb };
}

export default async function SectionPage({ params }: Params) {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  const counts = await countBySubsection(section.key);

  return (
    <div className="contenedor">
      <PageHeader
        trail={[{ href: "/home", label: "Inicio" }]}
        eyebrow="Sección"
        title={section.name}
        description={section.blurb}
      />
      <SubsectionGrid section={section} counts={counts} />
    </div>
  );
}
