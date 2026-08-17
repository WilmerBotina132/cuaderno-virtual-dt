/**
 * Crea (o actualiza) la unica cuenta de administrador.
 *
 *   npm run db:seed
 *
 * Lee ADMIN_USERNAME y ADMIN_PASSWORD del archivo .env y guarda la contrasena
 * hasheada con bcrypt. Para cambiar la clave: edita ADMIN_PASSWORD y vuelve a
 * ejecutar el comando; el usuario se actualiza en vez de duplicarse.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// `tsx` no carga .env por su cuenta; Node >= 20.6 sabe hacerlo.
try {
  process.loadEnvFile(".env");
} catch {
  // No hay .env (por ejemplo en CI): se usan las variables ya presentes.
}

const prisma = new PrismaClient();

async function main() {
  const username = (process.env.ADMIN_USERNAME ?? "admin").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "Falta ADMIN_PASSWORD en el archivo .env. Copia .env.example a .env y rellenalo.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash, name: "Administrador" },
  });

  console.log(`Administrador listo: "${user.username}" (id ${user.id})`);
  console.log("La contrasena quedo guardada hasheada, nunca en texto plano.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
