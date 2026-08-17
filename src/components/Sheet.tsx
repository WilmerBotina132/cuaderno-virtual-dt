import type { HTMLAttributes } from "react";

import styles from "./Sheet.module.scss";

interface SheetProps extends HTMLAttributes<HTMLElement> {
  /** Etiqueta HTML a usar. Por defecto un `div`. */
  as?: "div" | "article" | "section" | "li" | "aside";
  /** Anade el segundo marco interior, como el margen de una lamina real. */
  framed?: boolean;
  /**
   * Enciende las marcas de registro en las esquinas al pasar el cursor.
   * Reservado para laminas en las que se puede hacer clic.
   */
  interactive?: boolean;
}

/**
 * La superficie basica del sitio: una hoja de papel con su marco de 1px.
 * Todo el contenido publico se apoya sobre una de estas.
 */
export default function Sheet({
  as: Tag = "div",
  framed = false,
  interactive = false,
  className,
  children,
  ...rest
}: SheetProps) {
  const classes = [
    styles.sheet,
    framed ? styles.framed : "",
    interactive ? styles.interactive : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
