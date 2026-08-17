"use client";

import { deletePost } from "./actions";
import styles from "./admin.module.scss";

export default function DeletePostButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deletePost.bind(null, id)}
      onSubmit={(event) => {
        const ok = window.confirm(
          `¿Eliminar "${title}"? También se borrarán sus fotos y videos subidos.`,
        );
        if (!ok) event.preventDefault();
      }}
    >
      <button type="submit" className={styles.danger}>
        Eliminar
      </button>
    </form>
  );
}
