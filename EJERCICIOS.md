# 📝 Guía de Ejercicios — Cuaderno Virtual

Esta guía propone mejoras reales al Cuaderno Virtual. No son ejercicios inventados:
cada uno agrega algo que el sitio hoy no tiene, y al terminarlo el proyecto queda mejor
de lo que estaba.

Antes de empezar conviene tener el proyecto andando en local (ver `README.md`) y haber
leído `CONCEPTOS.md`, que explica las ideas de Next.js que se usan acá.

## 📋 Índice de Ejercicios

1. [Estilos y accesibilidad](#1-estilos-y-accesibilidad)
2. [Buscador de publicaciones](#2-buscador-de-publicaciones)
3. [Página individual de una publicación](#3-página-individual-de-una-publicación)
4. [Paginación](#4-paginación)
5. [Modo oscuro](#5-modo-oscuro)
6. [Láminas destacadas](#6-láminas-destacadas)
7. [Errores por campo en el formulario](#7-errores-por-campo-en-el-formulario)
8. [Reordenar las publicaciones](#8-reordenar-las-publicaciones)

---

## 1. Estilos y accesibilidad

**Archivos**: varios `.module.scss`, `src/components/EmptyState.tsx`
**Nivel**: Básico
**Conceptos**: SCSS Modules, variables CSS, diseño responsive, foco visible

### Objetivo

Familiarizarte con el sistema visual antes de tocar lógica. Todo el diseño se apoya en
variables CSS declaradas en `src/app/globals.scss` (`--papel`, `--tinta`, `--acento`,
`--paso-1` a `--paso-8`), y los componentes solo las consumen con `var(...)`.

### Pasos

1. **Leé los tokens** en `src/app/globals.scss` y ubicá de dónde sale cada color.

2. **Cambiá el acento de una sección.** En `src/lib/sections.ts` cada sección define su
   color. Probá cambiarlo y mirá cómo se propaga solo:

   ```ts
   accent: "#c8590c",
   accentSoft: "rgba(200, 89, 12, 0.12)",
   ```

   Funciona porque `src/app/(public)/[section]/layout.tsx` inyecta esos valores como
   variables CSS, y todo lo que cuelga de la sección las hereda.

3. **Mejorá el estado vacío.** `src/components/EmptyState.tsx` aparece cuando una lámina
   no tiene material. Agregale un ícono SVG o un enlace de vuelta a la sección.

4. **Revisá el foco del teclado.** Navegá el sitio usando solo Tab. Todo lo que se puede
   pulsar debe mostrar un contorno visible (lo define `:focus-visible` en `globals.scss`).

### Verificación

- ✅ Cambiar `accent` en un solo archivo repinta toda la sección
- ✅ El sitio se ve bien en 360px de ancho, sin barra de desplazamiento horizontal
- ✅ Se puede recorrer todo el sitio con Tab y siempre se ve dónde está el foco

---

## 2. Buscador de publicaciones

**Archivos**: `src/components/PostSearch.tsx` (nuevo), `src/components/SubsectionPage.tsx`
**Nivel**: Básico-Intermedio
**Conceptos**: Client Components, `useState`, pasar datos de servidor a cliente

### Objetivo

Agregar un campo de búsqueda que filtre las publicaciones de la página actual mientras
se escribe.

### Pasos

1. **Entendé la división.** `SubsectionPage.tsx` es un Server Component: consulta la base
   de datos con `await listPosts(...)`. No puede usar `useState`. Por eso el buscador
   tiene que ser un Client Component aparte, que recibe las publicaciones como props.

2. **Creá el componente**:

   ```tsx
   "use client";

   import { useState } from "react";
   import type { PostWithMedia } from "@/lib/posts";
   import PostList from "./PostList";

   export default function PostSearch({ posts }: { posts: PostWithMedia[] }) {
     const [texto, setTexto] = useState("");

     const filtrados = posts.filter((post) =>
       `${post.title} ${post.summary ?? ""}`
         .toLowerCase()
         .includes(texto.trim().toLowerCase()),
     );

     return (
       <>
         <input
           type="search"
           value={texto}
           onChange={(e) => setTexto(e.target.value)}
           placeholder="Buscar en esta página…"
           aria-label="Buscar publicaciones"
         />
         {filtrados.length > 0 ? (
           <PostList posts={filtrados} />
         ) : (
           <p>No hay publicaciones que coincidan con esa búsqueda.</p>
         )}
       </>
     );
   }
   ```

3. **Usalo** en `SubsectionPage.tsx` en lugar de `<PostList posts={posts} />`.

4. **Ocultalo cuando no haga falta**: si hay menos de 3 publicaciones, el buscador estorba.

### Verificación

- ✅ Al escribir se filtran las publicaciones sin recargar la página
- ✅ Si no hay coincidencias aparece un mensaje, no una lista vacía
- ✅ Borrar el texto devuelve todas las publicaciones

---

## 3. Página individual de una publicación

**Archivo**: `src/app/(public)/publicacion/[slug]/page.tsx` (nuevo)
**Nivel**: Intermedio
**Conceptos**: rutas dinámicas, `params` asíncronos, `notFound()`, `generateMetadata`

### Objetivo

Hoy las publicaciones se muestran todas juntas dentro de su sección. Falta una página
propia para poder compartir el enlace de una sola.

Buena noticia: la base ya guarda un `slug` único por publicación y `src/lib/posts.ts` ya
tiene la función `getPostBySlug()` lista, pero **nadie la usa todavía**. Tu trabajo es
darle una página.

### Pasos

1. **Creá la ruta.** En Next 16 los `params` llegan como promesa, hay que esperarlos:

   ```tsx
   import { notFound } from "next/navigation";
   import { getPostBySlug } from "@/lib/posts";

   export const dynamic = "force-dynamic";

   type Params = { params: Promise<{ slug: string }> };

   export default async function PublicacionPage({ params }: Params) {
     const { slug } = await params;
     const post = await getPostBySlug(slug);
     if (!post) notFound();

     return <article>{/* título, resumen, texto y medios */}</article>;
   }
   ```

2. **Reutilizá lo que ya existe.** Mirá cómo `src/components/PostList.tsx` dibuja los
   videos de YouTube, los archivos subidos y los enlaces. Extraé esa parte a un componente
   `PostCard` propio en vez de duplicar el código.

3. **Agregá `generateMetadata`** para que el título de la pestaña y el enlace compartido
   muestren el nombre de la publicación. Guiate por
   `src/app/(public)/[section]/planos/[topic]/page.tsx`.

4. **Enlazá desde la lista**: que el título de cada publicación lleve a su página.

### Verificación

- ✅ `/publicacion/<slug>` muestra una sola publicación
- ✅ Un slug inexistente muestra la página 404 del sitio
- ✅ La pestaña del navegador muestra el título de la publicación
- ✅ Las publicaciones ocultas (`published: false`) devuelven 404

---

## 4. Paginación

**Archivos**: `src/components/SubsectionPage.tsx`, `src/lib/posts.ts`
**Nivel**: Intermedio
**Conceptos**: `searchParams`, `skip` y `take` en Prisma

### Objetivo

Cuando una lámina acumule veinte publicaciones, la página se va a hacer larguísima.
Mostrá de a 6 y agregá navegación entre páginas.

### Pasos

1. **Aceptá el número de página por la URL** (`?pagina=2`). Igual que `params`, los
   `searchParams` son una promesa:

   ```tsx
   const { pagina } = await searchParams;
   const actual = Math.max(1, Number(pagina) || 1);
   ```

2. **Paginá en la consulta, no en memoria.** Modificá `listPosts` en `src/lib/posts.ts`
   para aceptar `skip` y `take`, y devolvé también el total con `prisma.post.count()`:

   ```ts
   const POR_PAGINA = 6;
   // skip: (actual - 1) * POR_PAGINA
   // take: POR_PAGINA
   ```

   Traer 200 publicaciones para mostrar 6 desperdicia memoria y tiempo.

3. **Dibujá los enlaces** «Anterior» y «Siguiente» con `<Link>`, conservando la ruta
   actual y cambiando solo el parámetro.

4. **Cuidá los bordes**: página 1 sin «Anterior», última sin «Siguiente», y una página
   fuera de rango que no rompa nada.

### Verificación

- ✅ Con más de 6 publicaciones aparecen los controles
- ✅ `?pagina=2` muestra el segundo grupo
- ✅ `?pagina=999` no rompe la página
- ✅ Los contadores de la portada siguen mostrando el total real

---

## 5. Modo oscuro

**Archivos**: `src/app/globals.scss`, `src/components/ThemeToggle.tsx` (nuevo)
**Nivel**: Intermedio
**Conceptos**: variables CSS, `localStorage`, evitar el parpadeo inicial

### Objetivo

El diseño ya está preparado sin saberlo: como todos los colores son variables CSS, un
tema oscuro es redefinir esas variables, no reescribir estilos.

### Pasos

1. **Agregá la paleta oscura** al final de `src/app/globals.scss`:

   ```scss
   :root[data-tema="oscuro"] {
     --papel: #12171c;
     --lamina: #1a2027;
     --tinta: #e8ecea;
     --grafito: #9aa7b0;
     --trazo: #2c353d;
     --grid-fino: rgba(232, 236, 234, 0.03);
     --grid-grueso: rgba(232, 236, 234, 0.05);
   }
   ```

   Fijate que no tocás ni un componente: todos leen `var(--papel)` y compañía.

2. **Creá el botón** que alterne `document.documentElement.dataset.tema` y guarde la
   preferencia en `localStorage`.

3. **Evitá el parpadeo.** Si aplicás el tema recién cuando React monta, la página aparece
   clara un instante. Investigá cómo insertar un script pequeño en el `<head>` de
   `src/app/layout.tsx` que lea `localStorage` antes de pintar.

4. **Respetá el sistema**: si nunca eligió, usá `prefers-color-scheme`.

### Verificación

- ✅ El botón cambia todos los colores del sitio
- ✅ La preferencia sobrevive al recargar
- ✅ No hay parpadeo claro al cargar en modo oscuro
- ✅ El texto mantiene buen contraste en ambos temas

---

## 6. Láminas destacadas

**Archivos**: `prisma/schema.prisma`, `src/lib/posts.ts`, `src/app/admin/PostForm.tsx`,
`src/app/admin/actions.ts`
**Nivel**: Intermedio-Avanzado
**Conceptos**: migraciones de base de datos, recorrer la aplicación de punta a punta

### Objetivo

Poder marcar publicaciones como destacadas para que aparezcan primero. Es el ejercicio
más completo: toca la base, el panel y el sitio público.

### Pasos

1. **Agregá el campo** al modelo `Post` en `prisma/schema.prisma`:

   ```prisma
   destacada Boolean @default(false)
   ```

2. **Creá la migración**:

   ```bash
   npm run db:migrate -- --name laminas-destacadas
   ```

   Esto genera un archivo SQL en `prisma/migrations/`. Abrilo y leelo: entender qué
   ejecuta Prisma en tu nombre es parte del ejercicio.

3. **Sumalo al formulario** en `src/app/admin/PostForm.tsx`, junto a la casilla
   «Visible en el sitio público».

4. **Validalo en el servidor.** En `src/app/admin/actions.ts`, agregá el campo al esquema
   de zod y guardalo. Nunca confíes en lo que llega del navegador: cualquiera puede
   modificar el formulario antes de enviarlo.

5. **Ordená por destacadas** en `listPosts`:

   ```ts
   orderBy: [{ destacada: "desc" }, { publishedAt: "desc" }]
   ```

6. **Marcalas visualmente** en `PostList.tsx` con una franja del color de acento.

### Verificación

- ✅ `npm run db:migrate` corre sin errores y crea el SQL
- ✅ La casilla aparece en el panel y se guarda
- ✅ Las destacadas salen primero en el sitio público
- ✅ Enviar un valor inválido a mano no rompe el servidor

---

## 7. Errores por campo en el formulario

**Archivos**: `src/app/admin/actions.ts`, `src/app/admin/PostForm.tsx`
**Nivel**: Avanzado
**Conceptos**: zod, `useActionState`, accesibilidad de formularios

### Objetivo

Hoy, si el formulario tiene un problema, aparece **un solo mensaje arriba de todo**. Si
te equivocaste en el título, el mensaje no te dice en qué campo mirar. Mejoralo para que
cada campo muestre su propio error.

### Pasos

1. **Cambiá la forma del estado** en `actions.ts`:

   ```ts
   export interface PostFormState {
     error?: string;
     campos?: Record<string, string>;
   }
   ```

2. **Aprovechá zod.** Cuando `safeParse` falla, el error trae la ruta de cada problema:

   ```ts
   if (!parsed.success) {
     const campos: Record<string, string> = {};
     for (const issue of parsed.error.issues) {
       const campo = String(issue.path[0]);
       if (campo && !campos[campo]) campos[campo] = issue.message;
     }
     return { campos };
   }
   ```

3. **Mostralos junto a cada input**, y conectalos para lectores de pantalla:

   ```tsx
   <input name="title" aria-invalid={!!state.campos?.title} aria-describedby="error-title" />
   {state.campos?.title && <p id="error-title">{state.campos.title}</p>}
   ```

4. **Escribí mensajes útiles** en el esquema: «El título debe tener al menos 3 caracteres»
   sirve; «Invalid input» no.

### Verificación

- ✅ Un título de un carácter marca el error en el título, no arriba de todo
- ✅ Varios errores a la vez se muestran todos
- ✅ Los datos que ya habías escrito no se pierden al fallar
- ✅ Un lector de pantalla anuncia el error al enfocar el campo

---

## 8. Reordenar las publicaciones

**Archivos**: `prisma/schema.prisma`, `src/app/admin/actions.ts`, `src/app/admin/page.tsx`
**Nivel**: Avanzado
**Conceptos**: Server Actions, `revalidatePath`, transacciones

### Objetivo

Que el orden de las publicaciones dentro de una lámina se pueda decidir a mano, en vez de
depender siempre de la fecha.

### Pasos

1. **Agregá el campo** `posicion Int @default(0)` al modelo `Post` y migrá. El modelo
   `MediaItem` ya tiene algo así (`position`): miralo como referencia.

2. **Creá la Server Action** en `actions.ts`. Acordate de comprobar la sesión, como hacen
   todas las demás:

   ```ts
   "use server";

   export async function moverPublicacion(id: string, direccion: -1 | 1) {
     const session = await requireAdmin();
     if (!session) redirect("/login");

     // 1. buscar la publicación y su vecina en esa dirección
     // 2. intercambiar sus valores de `posicion` dentro de una transacción
     await prisma.$transaction([/* ... */]);

     revalidatePath("/", "layout");
   }
   ```

3. **Usá una transacción.** Si intercambiás dos posiciones con dos escrituras sueltas y la
   segunda falla, quedan dos publicaciones con el mismo número. `$transaction` garantiza
   que se apliquen las dos o ninguna.

4. **Agregá los botones ↑ ↓** en la lista del panel. En `PostForm.tsx` ya hay botones así
   para reordenar los medios: copiá el patrón.

5. **Ordená por `posicion`** en las consultas públicas.

### Verificación

- ✅ Los botones cambian el orden y el cambio persiste
- ✅ El primero no puede subir y el último no puede bajar
- ✅ El nuevo orden se refleja en el sitio público
- ✅ Sin sesión, la acción redirige a `/login`

---

## 🎯 Orden sugerido

**Para empezar**

1. Estilos y accesibilidad
2. Buscador de publicaciones

**Cuando ya te muevas cómodo**

3. Página individual de una publicación
4. Paginación
5. Modo oscuro

**Para cerrar**

6. Láminas destacadas
7. Errores por campo en el formulario
8. Reordenar las publicaciones

Los tres últimos tocan la base de datos y el servidor, así que conviene hacerlos cuando ya
entiendas cómo viajan los datos desde Postgres hasta la pantalla.

---

## 💡 Consejos

- **El código del proyecto es tu mejor ejemplo.** Antes de escribir algo nuevo, buscá si ya
  existe algo parecido. ¿Rutas dinámicas? Mirá `[section]/planos/[topic]/page.tsx`.
  ¿Server Actions? `admin/actions.ts`. ¿Formularios? `PostForm.tsx`.

- **Servidor y cliente no son lo mismo.** Si un componente usa `useState` o `onClick`,
  necesita `"use client"` arriba. Si consulta la base de datos, tiene que ser de servidor.
  Confundirlos es el error más común al empezar.

- **Nunca confíes en el navegador.** Cualquiera puede modificar un formulario antes de
  enviarlo. Por eso toda acción del panel vuelve a comprobar la sesión y a validar los
  datos con zod en el servidor.

- **Revisá antes de subir**: `npm run build` y `npm run lint` tienen que pasar sin errores.
  Vercel corre lo mismo, así que si falla acá, falla el despliegue.

- **Cuidado con `.env`.** Nunca lo subas a git. Ya está ignorado, dejalo así.

---

## 🆘 ¿Te trabaste?

1. Leé el mensaje de error completo, hasta abajo. Suele decir el archivo y la línea.
2. Buscá en el proyecto un caso parecido ya resuelto.
3. Usá `console.log()` — en Server Components sale en la terminal, no en el navegador.
4. Revisá la [documentación de Next.js](https://nextjs.org/docs) y la
   [de Prisma](https://www.prisma.io/docs).
5. Si tocaste el esquema y algo quedó raro, `npm run db:studio` te deja ver la base.

---

**¡A dibujar! 📐**
