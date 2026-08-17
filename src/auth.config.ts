import type { NextAuthConfig } from "next-auth";

/**
 * Configuracion de Auth.js que NO depende de la base de datos ni de bcrypt.
 *
 * Vive aparte de `auth.ts` para poder importarse desde contextos ligeros
 * (por ejemplo `proxy.ts`) sin arrastrar el cliente de Prisma.
 */
export const authConfig = {
  // La pagina de inicio de sesion es propia y esta oculta de la navegacion.
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Sesion en JWT firmado dentro de una cookie httpOnly: no hace falta
  // guardar sesiones en Postgres para un solo administrador.
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 horas
  },
  trustHost: true,
  providers: [],
} satisfies NextAuthConfig;

/**
 * Nombres posibles de la cookie de sesion de Auth.js.
 * En HTTPS el navegador recibe la variante con prefijo `__Secure-`.
 */
export const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
] as const;
