import type { ReactNode } from "react";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

import styles from "./layout.module.scss";

/** Marco comun del sitio publico: encabezado, contenido y pie. */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <a href="#contenido" className="saltar-al-contenido">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" className={styles.main}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
