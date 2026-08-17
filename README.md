# 📐 Cuaderno Virtual — Dibujo Técnico y Diseño Aplicado

Sitio del curso **9-2** del **I.E.M Técnico Industrial** (Pasto, Nariño) para publicar las
láminas, los videos de apoyo y las consultas de las dos áreas de la especialidad.

El contenido ya no está escrito en el código: se administra desde un panel privado y se
guarda en PostgreSQL.

---

## Cómo está organizado el sitio

| Ruta | Qué es |
|---|---|
| `/` | Redirige a `/home` |
| `/home` | Portada, con las dos secciones |
| `/diseno-aplicado` | Sección 1 — Videos de apoyo · Consultas · Planos |
| `/diseno-aplicado/planos` | Índice de láminas (Planos, Tornillo, Proyecto N°1, Proyecto N°2, Tornillo en perspectiva) |
| `/fundamentacion-tecnologica` | Sección 2 — Planos · Videos de apoyo · Consultas |
| `/fundamentacion-tecnologica/planos` | Índice de láminas (Planos, Tornillo, Proyecto, Carpeta, Proyecto N°2, Calderería) |
| `/login` | Acceso del administrador. **Oculto**: no se enlaza desde ninguna parte del sitio |
| `/admin` | Panel para crear, editar y borrar publicaciones. Exige sesión |

Las dos sub-páginas de Planos son rutas distintas pero comparten el mismo componente
([`TopicList`](src/components/TopicList.tsx)); lo único que cambia es la lista de temas,
definida en [`src/lib/sections.ts`](src/lib/sections.ts). Ese archivo es la única fuente
de verdad de la navegación: para renombrar o agregar una lámina, se edita ahí.

---

## Tecnologías

| Pieza | Qué se usó |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | SCSS Modules sobre variables CSS |
| Animación | Framer Motion (entradas suaves, respeta `prefers-reduced-motion`) |
| Base de datos | PostgreSQL en Neon, con Prisma como ORM |
| Autenticación | Auth.js (NextAuth v5) — proveedor de credenciales, sesión en JWT |
| Archivos | Vercel Blob (subida directa desde el navegador) |
| Despliegue | Vercel |

---

## Poner el proyecto a andar en local

```bash
npm install
cp .env.example .env      # y rellenar los valores
npm run db:deploy         # crea las tablas
npm run db:seed           # crea la cuenta de administrador
npm run dev
```

Sin `DATABASE_URL` el sitio **igual arranca**: las secciones se ven vacías en lugar de
romperse, para poder trabajar en el diseño antes de tener la base de datos.

### Comandos

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run db:deploy` | Aplica las migraciones (producción) |
| `npm run db:migrate` | Crea una migración nueva tras cambiar el esquema |
| `npm run db:push` | Sincroniza el esquema sin migraciones (atajo para desarrollo) |
| `npm run db:seed` | Crea o actualiza el usuario administrador |
| `npm run db:studio` | Explorador visual de la base de datos |

---

## Pasos manuales para publicar en Vercel

Todo esto se hace **fuera del código**, una sola vez.

### 1. Base de datos en Neon

1. Entrar a [neon.tech](https://neon.tech) y crear un proyecto (el plan gratuito alcanza).
2. En **Connection string**, copiar las dos variantes:
   - **Pooled connection** (el host lleva `-pooler`) → será `DATABASE_URL`.
   - **Direct connection** (sin `-pooler`) → será `DIRECT_URL`.
3. Guardar ambas; se usan en el paso 4.

> Las migraciones necesitan la conexión directa porque el *pooler* no admite algunas
> operaciones de esquema. Por eso son dos variables y no una.

### 2. Proyecto en Vercel

1. Subir el repositorio a GitHub.
2. En [vercel.com](https://vercel.com) → **Add New… → Project** → importar el repositorio.
3. Vercel detecta Next.js solo; no hay que tocar los comandos de build.
4. **No desplegar todavía**: primero cargar las variables del paso 4.

### 3. Almacenamiento de archivos (Vercel Blob)

1. En el proyecto de Vercel → pestaña **Storage** → **Create Database** → **Blob**.
2. Conectarlo al proyecto. Vercel agrega solo la variable `BLOB_READ_WRITE_TOKEN`.
3. Para poder subir archivos también desde local:
   ```bash
   npx vercel link
   npx vercel env pull .env
   ```

### 4. Variables de entorno en Vercel

En **Settings → Environment Variables**, para *Production* y *Preview*:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | Cadena *pooled* de Neon |
| `DIRECT_URL` | Cadena *directa* de Neon |
| `AUTH_SECRET` | Generar con `npx auth secret` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | La contraseña que se quiera |
| `BLOB_READ_WRITE_TOKEN` | La agrega Vercel al conectar el Blob |

### 5. Crear las tablas y el administrador

Con el `.env` local ya apuntando a Neon:

```bash
npm run db:deploy
npm run db:seed
```

### 6. Desplegar y comprobar

Lanzar el deploy en Vercel y revisar que `/home` cargue, que las dos secciones naveguen
y que `/login` deje entrar al panel.

### 7. Dominio propio (opcional)

**Settings → Domains** → agregar `cuadernovirtual.com` y seguir las instrucciones de DNS.

---

## Sobre la cuenta de administrador

- Hay **una sola cuenta** y **no existe registro público** en ninguna parte del sitio.
- La contraseña nunca está escrita en el código: sale de `ADMIN_PASSWORD` y se guarda
  hasheada con bcrypt.
- Para cambiarla: editar `ADMIN_PASSWORD` y volver a ejecutar `npm run db:seed`. El
  usuario se actualiza, no se duplica.

`/admin` está protegido en tres capas:

1. [`src/proxy.ts`](src/proxy.ts) — redirige a `/login` si no hay cookie de sesión.
2. [`src/app/admin/layout.tsx`](src/app/admin/layout.tsx) — verifica la firma del JWT en el
   servidor antes de renderizar. Es el control que manda.
3. [`src/app/admin/actions.ts`](src/app/admin/actions.ts) — cada acción de guardar o borrar
   vuelve a comprobar la sesión.

---

## Límites de los archivos que se suben

Los archivos van directamente del navegador a Vercel Blob, sin pasar por el servidor: por
eso no aplica el tope de 4,5 MB que tienen las funciones de Vercel.

Los topes que fija este proyecto están en [`src/lib/media.ts`](src/lib/media.ts):

| Tipo | Máximo |
|---|---|
| Foto | 15 MB |
| Video subido | 500 MB |

El plan gratuito de Vercel incluye una cuota de almacenamiento y de transferencia
limitada, y un video de clase la consume rápido. **Para videos largos conviene subirlos a
YouTube y pegar el enlace**: no gastan cuota y cargan mejor.
