import Link from "next/link";
import type { CSSProperties } from "react";

import { countLabel } from "@/lib/format";
import {
  subsectionHref,
  type SectionDef,
  type SubsectionKey,
} from "@/lib/sections";

import Sheet from "./Sheet";
import styles from "./SectionCard.module.scss";

/**
 * Tarjeta de una de las dos secciones en la portada.
 * El titulo lleva a la seccion completa y cada fila entra directo a su
 * sub-pagina, para no obligar a pasar por una pantalla intermedia.
 */
export default function SectionCard({
  section,
  counts,
}: {
  section: SectionDef;
  counts: Record<SubsectionKey, number>;
}) {
  return (
    <Sheet
      as="article"
      interactive
      className={styles.card}
      style={
        {
          "--acento": section.accent,
          "--acento-suave": section.accentSoft,
        } as CSSProperties
      }
    >
      <span className={styles.rule} aria-hidden="true" />

      <div className={styles.head}>
        <p className={styles.tag}>Sección</p>
        <h2 className={styles.title}>
          <Link href={`/${section.slug}`}>{section.name}</Link>
        </h2>
        <p className={styles.blurb}>{section.blurb}</p>
      </div>

      <ul className={styles.rows}>
        {section.subsections.map((subsection) => (
          <li key={subsection.slug}>
            <Link href={subsectionHref(section, subsection)} className={styles.row}>
              <span className={styles.rowName}>{subsection.name}</span>
              <span className={styles.rowCount}>{countLabel(counts[subsection.key])}</span>
              <span className={styles.rowArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
