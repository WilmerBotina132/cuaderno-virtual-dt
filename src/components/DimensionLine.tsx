import styles from "./DimensionLine.module.scss";

/**
 * Una linea de cota, como la que en un plano indica una medida entre dos
 * puntos. Aqui mide el contenido: dice cuantas laminas hay en la lista que
 * viene a continuacion.
 */
export default function DimensionLine({ label }: { label: string }) {
  return (
    <p className={styles.cota}>
      <span className={styles.tick} aria-hidden="true" />
      <span className={`${styles.line} ${styles.lineLeft}`} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
      <span className={`${styles.line} ${styles.lineRight}`} aria-hidden="true" />
      <span className={styles.tick} aria-hidden="true" />
    </p>
  );
}
