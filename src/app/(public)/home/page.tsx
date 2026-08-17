import type { Metadata } from "next";

import PostList from "@/components/PostList";
import Reveal from "@/components/Reveal";
import SectionCard from "@/components/SectionCard";
import Sheet from "@/components/Sheet";
import TitleBlock from "@/components/TitleBlock";
import { countBySubsection, listRecentPosts } from "@/lib/posts";
import { SECTION_LIST } from "@/lib/sections";
import { SITE } from "@/lib/site";

import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
};

// El contenido sale de la base de datos, asi que la portada se arma en cada
// visita en lugar de quedarse congelada en el momento del despliegue.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [designCounts, foundationCounts, recent] = await Promise.all([
    countBySubsection("DISENO_APLICADO"),
    countBySubsection("FUNDAMENTACION_TECNOLOGICA"),
    listRecentPosts(3),
  ]);

  const counts = {
    DISENO_APLICADO: designCounts,
    FUNDAMENTACION_TECNOLOGICA: foundationCounts,
  };

  return (
    <div className="contenedor">
      {/* La portada del cuaderno es, literalmente, la caratula de un juego de
          planos: marco doble, titulo rotulado y cajetin con los datos. */}
      <Sheet framed className={styles.cover}>
        <div className={styles.coverInner}>
          <p className={styles.eyebrow}>Portada</p>
          <h1 className={styles.title}>
            <span>Cuaderno</span>
            <span>Virtual</span>
          </h1>
          <p className={styles.lead}>
            Todo lo trabajado en Diseño Aplicado y Fundamentación Tecnológica: las
            láminas dibujadas durante el periodo, los videos que explican cada
            procedimiento y las consultas resueltas en clase.
          </p>
        </div>

        <TitleBlock
          fields={[
            { label: "Institución", value: SITE.institution },
            { label: "Área", value: SITE.tagline },
            { label: "Curso", value: SITE.course },
            { label: "Elaboró", value: SITE.author },
          ]}
        />
      </Sheet>

      <section className={styles.sections} aria-label="Secciones del cuaderno">
        {SECTION_LIST.map((section, index) => (
          <Reveal key={section.slug} delay={index * 0.08} className={styles.sectionCell}>
            <SectionCard section={section} counts={counts[section.key]} />
          </Reveal>
        ))}
      </section>

      {recent.length > 0 && (
        <section className={styles.recent} aria-labelledby="recientes">
          <div className={styles.recentHead}>
            <h2 id="recientes" className={styles.recentTitle}>
              Lo último publicado
            </h2>
            <p className={styles.recentMeta}>Últimas {recent.length}</p>
          </div>
          <PostList posts={recent} />
        </section>
      )}
    </div>
  );
}
