import type { ReactNode } from "react";

import styles from "./TitleBlock.module.scss";

export interface TitleBlockField {
  label: string;
  value: ReactNode;
}

/**
 * El cajetin: el recuadro rotulado que en un plano real va abajo a la derecha
 * y dice quien dibujo la lamina, en que escala y en que fecha.
 * Aqui se reutiliza para dar los datos de la materia y del curso.
 */
export default function TitleBlock({
  fields,
  className,
}: {
  fields: TitleBlockField[];
  className?: string;
}) {
  return (
    <dl className={`${styles.block} ${className ?? ""}`}>
      {fields.map((field) => (
        <div key={field.label} className={styles.cell}>
          <dt className={styles.label}>{field.label}</dt>
          <dd className={styles.value}>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
