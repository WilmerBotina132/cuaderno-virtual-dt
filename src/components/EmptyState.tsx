import styles from "./EmptyState.module.scss";

/**
 * Hueco reservado: el area de dibujo de una lamina que todavia no se ha
 * empezado. Explica que falta sin sugerir que algo salio mal.
 */
export default function EmptyState({
  title = "Lámina en blanco",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className={styles.empty}>
      <p className={styles.tag}>Sin publicaciones</p>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
