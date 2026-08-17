import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Sheet from "@/components/Sheet";
import { SITE } from "@/lib/site";

import LoginForm from "./LoginForm";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Acceso",
  // Pagina oculta: no se enlaza desde el sitio y se pide no indexarla.
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Si ya hay sesion abierta, no tiene sentido volver a pedir la clave.
  const session = await auth();
  if (session?.user) redirect("/admin");

  const { next } = await searchParams;

  return (
    <main className={styles.page}>
      <Sheet framed className={styles.card}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Acceso restringido</p>
          <h1 className={styles.title}>Panel del cuaderno</h1>
          <p className={styles.note}>
            Esta entrada es solo para quien administra las publicaciones.
          </p>

          <LoginForm next={next ?? "/admin"} />
        </div>

        <p className={styles.foot}>
          <Link href="/home">← Volver al cuaderno</Link>
          <span>{SITE.institution}</span>
        </p>
      </Sheet>
    </main>
  );
}
