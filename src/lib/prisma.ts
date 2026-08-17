import { PrismaClient } from "@prisma/client";

/**
 * URL de reserva para cuando todavia no se ha configurado Neon.
 *
 * Sin esto, construir el cliente sin DATABASE_URL lanza una excepcion al
 * importar el modulo y el sitio entero deja de compilar. Con la reserva, el
 * cliente se crea igual y el fallo aparece al consultar, donde `safeQuery`
 * (ver src/lib/posts.ts) lo atrapa y muestra las secciones vacias.
 */
const PLACEHOLDER_URL = "postgresql://sin-configurar@localhost:5432/sin-configurar";

// En desarrollo Next recarga los modulos en caliente, y cada recarga crearia
// un PrismaClient nuevo hasta agotar las conexiones de Neon. Guardamos la
// instancia en el objeto global para reutilizarla.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || PLACEHOLDER_URL,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/** `true` si hay una cadena de conexion real configurada. */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);
