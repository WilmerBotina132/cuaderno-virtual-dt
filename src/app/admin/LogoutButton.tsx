import { logout } from "./actions";
import styles from "./admin.module.scss";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className={styles.logout}>
        Salir
      </button>
    </form>
  );
}
