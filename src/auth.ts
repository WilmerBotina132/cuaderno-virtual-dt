import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { authConfig } from "./auth.config";
import { prisma } from "./lib/prisma";

const credentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

/**
 * Unico proveedor: usuario y contrasena contra la tabla `users`.
 *
 * No hay registro publico. El administrador se crea con `npm run db:seed`,
 * que lee ADMIN_USERNAME / ADMIN_PASSWORD del entorno y guarda la contrasena
 * hasheada con bcrypt. En la base de datos nunca hay texto plano.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { username: username.trim().toLowerCase() },
        });
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        return { id: user.id, name: user.name ?? user.username };
      },
    }),
  ],
});

/**
 * Devuelve la sesion solo si hay administrador autenticado.
 * Es el chequeo autoritativo: se ejecuta en el servidor, en Node, y verifica
 * la firma del JWT. `proxy.ts` solo hace una comprobacion previa de UX.
 */
export async function requireAdmin() {
  const session = await auth();
  return session?.user ? session : null;
}
