import Link from "next/link";

import { countLabel } from "@/lib/format";
import {
  subsectionHref,
  type SectionDef,
  type SubsectionKey,
} from "@/lib/sections";

import Reveal from "./Reveal";
import Sheet from "./Sheet";
import styles from "./SubsectionGrid.module.scss";

/** Las tres sub-paginas de una seccion, en el orden que define la materia. */
export default function SubsectionGrid({
  section,
  counts,
}: {
  section: SectionDef;
  counts: Record<SubsectionKey, number>;
}) {
  return (
    <div className={styles.grid}>
      {section.subsections.map((subsection, index) => (
        <Reveal key={subsection.slug} delay={index * 0.06} className={styles.cell}>
          <Sheet as="article" interactive className={styles.card}>
            <Link href={subsectionHref(section, subsection)} className={styles.link}>
              <h2 className={styles.title}>{subsection.name}</h2>
              <p className={styles.blurb}>{subsection.blurb}</p>
              <p className={styles.foot}>
                <span>{countLabel(counts[subsection.key])}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </p>
            </Link>
          </Sheet>
        </Reveal>
      ))}
    </div>
  );
}
