import Link from "next/link";

import styles from "./PageHeader.module.scss";

export interface Crumb {
  href: string;
  label: string;
}

/**
 * Cabecera de las paginas interiores. Repite la logica del cajetin: primero
 * la ruta recorrida, luego el nombre de la lamina y sus datos.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  trail,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  trail?: Crumb[];
}) {
  return (
    <header className={styles.header}>
      {trail && trail.length > 0 && (
        <nav aria-label="Ruta de navegación" className={styles.trail}>
          {trail.map((crumb, index) => (
            <span key={crumb.href} className={styles.crumb}>
              {index > 0 && (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              )}
              <Link href={crumb.href}>{crumb.label}</Link>
            </span>
          ))}
        </nav>
      )}

      <div className={styles.body}>
        <div>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
        </div>
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>

      {description && <p className={styles.description}>{description}</p>}
    </header>
  );
}
