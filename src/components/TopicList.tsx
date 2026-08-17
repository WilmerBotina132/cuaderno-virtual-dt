import Link from "next/link";

import { countLabel, sheetNumber } from "@/lib/format";
import { topicHref, type SectionDef } from "@/lib/sections";

import Sheet from "./Sheet";
import styles from "./TopicList.module.scss";

/**
 * Indice de laminas de la sub-pagina "Planos".
 *
 * Es el mismo componente para las dos secciones: solo cambia la lista de temas
 * que llega en `section.topics`. La numeracion no es decorativa — un juego de
 * planos se archiva por numero de lamina, y ese es el orden que se sigue aqui.
 */
export default function TopicList({
  section,
  counts,
}: {
  section: SectionDef;
  counts: Record<string, number>;
}) {
  return (
    <Sheet className={styles.index}>
      <ol className={styles.rows}>
        {section.topics.map((topic, index) => {
          const total = counts[topic.slug] ?? 0;
          return (
            <li key={topic.slug}>
              <Link href={topicHref(section, topic)} className={styles.row}>
                <span className={styles.number} aria-hidden="true">
                  {sheetNumber(index)}
                </span>
                <span className={styles.name}>{topic.name}</span>
                <span className={styles.count}>{countLabel(total)}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </Sheet>
  );
}
