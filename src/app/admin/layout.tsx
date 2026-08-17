import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { requireAdmin } from "@/auth";
import { SITE } from "@/lib/site";

import LogoutButton from "./LogoutButton";
import styles from "./admin.module.scss";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Guardia autoritativa del panel.
 *
 * `proxy.ts` ya redirige a quien llega sin cookie, pero esa comprobacion solo
 * mira que la cookie exista. Aqui se verifica de verdad la firma del JWT, en el
 * servidor, antes de renderizar nada. Cualquier ruta bajo /admin pasa por aqui.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <Link href="/admin" className={styles.brand}>
            <span className={styles.brandName}>Panel</span>
            <span className={styles.brandSub}>{SITE.name}</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/admin">Publicaciones</Link>
            <Link href="/admin/posts/new">Nueva</Link>
            <Link href="/home" target="_blank" rel="noopener noreferrer">
              Ver el sitio
            </Link>
          </nav>

          <div className={styles.user}>
            <span>{session.user?.name ?? "admin"}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
