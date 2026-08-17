import Link from "next/link";

import { SECTION_LIST, subsectionHref } from "@/lib/sections";
import { SITE } from "@/lib/site";

import TitleBlock from "./TitleBlock";
import styles from "./SiteFooter.module.scss";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.about}>
            <p className={styles.name}>{SITE.name}</p>
            <p className={styles.blurb}>{SITE.description}</p>
          </div>

          {SECTION_LIST.map((section) => (
            <nav key={section.slug} className={styles.column} aria-label={section.name}>
              <p className={styles.columnTitle}>{section.name}</p>
              <ul className={styles.links}>
                {section.subsections.map((subsection) => (
                  <li key={subsection.slug}>
                    <Link href={subsectionHref(section, subsection)}>
                      {subsection.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <TitleBlock
          className={styles.block}
          fields={[
            { label: "Institución", value: SITE.institution },
            { label: "Área", value: SITE.tagline },
            { label: "Curso", value: SITE.course },
            { label: "Elaboró", value: SITE.authorShort },
          ]}
        />

        <p className={styles.legal}>
          © {year} {SITE.author} · {SITE.institution} · {SITE.city}
        </p>
      </div>
    </footer>
  );
}
