import { redirect } from "next/navigation";

/** La raiz no tiene contenido propio: la portada del cuaderno es /home. */
export default function RootPage() {
  redirect("/home");
}
