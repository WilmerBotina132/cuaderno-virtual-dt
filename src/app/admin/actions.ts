"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sectionByKey } from "@/lib/sections";
import { isYoutubeUrl } from "@/lib/youtube";

export interface PostFormState {
  error?: string;
}

const mediaSchema = z.object({
  kind: z.enum(["YOUTUBE", "VIDEO_UPLOAD", "IMAGE", "LINK"]),
  url: z.string().trim().min(1),
  label: z.string().trim().max(160).optional(),
  blobPathname: z.string().nullish(),
  sizeBytes: z.number().int().nonnegative().nullish(),
});

const postSchema = z.object({
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres."),
  summary: z.string().trim().max(400).optional(),
  body: z.string().max(20000).optional(),
  section: z.enum(["DISENO_APLICADO", "FUNDAMENTACION_TECNOLOGICA"]),
  subsection: z.enum(["VIDEOS", "CONSULTAS", "PLANOS"]),
  topic: z.string().trim().optional(),
  published: z.boolean(),
  media: z.array(mediaSchema).max(30),
});

type PostInput = z.infer<typeof postSchema>;

/** Convierte "Proyecto N°1" en "proyecto-n-1". */
function slugify(text: string): string {
  const base = text
    .normalize("NFD")
    // Quita las tildes y la virgulilla que deja `normalize`.
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "publicacion";
}

/** Anade un numero al final hasta que el slug no choque con otro. */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let counter = 2;

  for (;;) {
    const existing = await prisma.post.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

/** Lee el formulario y aplica las reglas que el esquema no puede expresar. */
function parseForm(formData: FormData): { data: PostInput } | { error: string } {
  let rawMedia: unknown = [];
  try {
    rawMedia = JSON.parse(String(formData.get("media") ?? "[]"));
  } catch {
    return { error: "No se pudo leer la lista de archivos y enlaces." };
  }

  const parsed = postSchema.safeParse({
    title: formData.get("title") ?? "",
    summary: formData.get("summary") ?? "",
    body: formData.get("body") ?? "",
    section: formData.get("section"),
    subsection: formData.get("subsection"),
    topic: formData.get("topic") ?? "",
    published: formData.get("published") === "on",
    media: rawMedia,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario." };
  }

  const data = parsed.data;

  // El tema solo existe dentro de Planos, y tiene que ser uno de los de la seccion.
  if (data.subsection === "PLANOS") {
    const section = sectionByKey(data.section);
    const valid = section.topics.some((t) => t.slug === data.topic);
    if (!valid) {
      return { error: "Elige a qué lámina de Planos pertenece la publicación." };
    }
  } else {
    data.topic = undefined;
  }

  for (const item of data.media) {
    if (item.kind === "YOUTUBE" && !isYoutubeUrl(item.url)) {
      return { error: `"${item.url}" no parece un enlace de YouTube válido.` };
    }
    if (item.kind === "LINK" && !/^https?:\/\//i.test(item.url)) {
      return { error: "Los enlaces externos deben empezar por http:// o https://" };
    }
  }

  return { data };
}

/** Borra de Vercel Blob los archivos que ya no usa ninguna publicacion. */
async function removeBlobs(urls: string[]) {
  if (urls.length === 0 || !process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(urls);
  } catch (error) {
    // Que falle el borrado del archivo no debe impedir guardar la publicacion.
    console.error("[blob] No se pudieron borrar los archivos:", error);
  }
}

function mediaRows(data: PostInput) {
  return data.media.map((item, index) => ({
    kind: item.kind,
    url: item.url,
    label: item.label || null,
    blobPathname: item.blobPathname ?? null,
    sizeBytes: item.sizeBytes ?? null,
    position: index,
  }));
}

export async function createPost(
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  const result = parseForm(formData);
  if ("error" in result) return { error: result.error };
  const { data } = result;

  try {
    const slug = await uniqueSlug(slugify(data.title));
    await prisma.post.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary || null,
        body: data.body || null,
        section: data.section,
        subsection: data.subsection,
        topic: data.topic ?? null,
        published: data.published,
        media: { create: mediaRows(data) },
      },
    });
  } catch (error) {
    console.error("[admin] Error al crear la publicación:", error);
    return { error: "No se pudo guardar. Revisa la conexión con la base de datos." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function updatePost(
  id: string,
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  const result = parseForm(formData);
  if ("error" in result) return { error: result.error };
  const { data } = result;

  try {
    const current = await prisma.post.findUnique({
      where: { id },
      include: { media: true },
    });
    if (!current) return { error: "Esta publicación ya no existe." };

    // Archivos que estaban guardados y ya no aparecen en el formulario.
    const keptUrls = new Set(data.media.map((m) => m.url));
    const orphanBlobs = current.media
      .filter((m) => m.blobPathname && !keptUrls.has(m.url))
      .map((m) => m.url);

    const slug = await uniqueSlug(slugify(data.title), id);

    // La lista de medios se reescribe entera: es mas simple y mas seguro que
    // intentar casar altas, bajas y cambios de orden uno por uno.
    await prisma.$transaction([
      prisma.mediaItem.deleteMany({ where: { postId: id } }),
      prisma.post.update({
        where: { id },
        data: {
          title: data.title,
          slug,
          summary: data.summary || null,
          body: data.body || null,
          section: data.section,
          subsection: data.subsection,
          topic: data.topic ?? null,
          published: data.published,
          media: { create: mediaRows(data) },
        },
      }),
    ]);

    await removeBlobs(orphanBlobs);
  } catch (error) {
    console.error("[admin] Error al actualizar la publicación:", error);
    return { error: "No se pudo guardar. Revisa la conexión con la base de datos." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deletePost(id: string) {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  const post = await prisma.post.findUnique({
    where: { id },
    include: { media: true },
  });
  if (!post) redirect("/admin");

  const blobUrls = post.media.filter((m) => m.blobPathname).map((m) => m.url);

  await prisma.post.delete({ where: { id } });
  await removeBlobs(blobUrls);

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
