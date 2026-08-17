import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

import { getSection, SECTION_LIST } from "@/lib/sections";

/** Rutas validas: solo las dos secciones reales de la materia. */
export function generateStaticParams() {
  return SECTION_LIST.map((section) => ({ section: section.slug }));
}

/**
 * Aplica el color de identidad de la seccion a todo lo que cuelga de ella.
 * Cada sub-pagina hereda `--acento` sin tener que saber en que seccion esta.
 */
export default async function SectionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = getSection(slug);

  if (!section) notFound();

  return (
    <div
      style={
        {
          "--acento": section.accent,
          "--acento-suave": section.accentSoft,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
