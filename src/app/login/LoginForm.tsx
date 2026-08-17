"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "./actions";
import styles from "./page.module.scss";

const initialState: LoginState = {};

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="next" value={next} />

      <label className={styles.field}>
        <span className={styles.label}>Usuario</span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          autoFocus
          className={styles.input}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Contraseña</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.input}
        />
      </label>

      {state.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
