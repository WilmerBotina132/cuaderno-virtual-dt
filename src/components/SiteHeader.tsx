"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties } from "react";

import { SECTION_LIST } from "@/lib/sections";
import { SITE } from "@/lib/site";

import styles from "./SiteHeader.module.scss";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // Al cambiar de pagina el menu movil se cierra solo. Se ajusta durante el
  // render en lugar de con un efecto: React lo recalcula antes de pintar y no
  // provoca un segundo renderizado.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const isHome = pathname === "/home";

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/home" className={styles.mark}>
          <span className={styles.markName}>{SITE.name}</span>
          <span className={styles.markSub}>
            {SITE.institution} · {SITE.course}
          </span>
        </Link>

        <nav
          id="navegacion-principal"
          aria-label="Secciones del cuaderno"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
        >
          <Link
            href="/home"
            className={`${styles.navLink} ${isHome ? styles.active : ""}`}
            aria-current={isHome ? "page" : undefined}
          >
            Inicio
          </Link>

          {SECTION_LIST.map((section) => {
            const active = pathname.startsWith(`/${section.slug}`);
            return (
              <Link
                key={section.slug}
                href={`/${section.slug}`}
                className={`${styles.navLink} ${active ? styles.active : ""}`}
                style={{ "--acento": section.accent } as CSSProperties}
                aria-current={active ? "page" : undefined}
              >
                {section.name}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="navegacion-principal"
        >
          <span className={styles.toggleLabel}>{menuOpen ? "Cerrar" : "Menú"}</span>
          <span className={styles.toggleIcon} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
  );
}
