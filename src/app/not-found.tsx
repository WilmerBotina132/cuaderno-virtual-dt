import Link from "next/link";

import Sheet from "@/components/Sheet";

import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <Sheet framed className={styles.card}>
        <div className={styles.inner}>
          <p className={styles.code}>Error 404</p>
          <h1 className={styles.title}>Esa lámina no existe</h1>
          <p className={styles.text}>
            La dirección que abriste no corresponde a ninguna sección del cuaderno.
            Vuelve a la portada y navega desde ahí.
          </p>
          <Link href="/home" className={styles.link}>
            Ir a la portada
          </Link>
        </div>
      </Sheet>
    </main>
  );
}
