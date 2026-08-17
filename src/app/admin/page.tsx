import Link from "next/link";

import { listAllPosts, type PostWithMedia } from "@/lib/posts";
import { postHref, sectionByKey, subsectionByKey } from "@/lib/sections";

import DeletePostButton from "./DeletePostButton";
import styles from "./admin.module.scss";
import list from "./list.module.scss";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function AdminPostsPage() {
  let posts: PostWithMedia[] = [];
  let dbError: string | null = null;

  try {
    posts = await listAllPosts();
  } catch (error) {
    console.error("[admin] No se pudo leer la lista de publicaciones:", error);
    dbError =
      "No hay conexión con la base de datos. Revisa DATABASE_URL en las variables de entorno y ejecuta las migraciones (npm run db:deploy).";
  }

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Publicaciones</h1>
        <div className={list.headActions}>
          <span className={styles.pageMeta}>
            {posts.length} en total
          </span>
          <Link href="/admin/posts/new" className={styles.primary}>
            Nueva publicación
          </Link>
        </div>
      </div>

      {dbError && <p className={styles.alert}>{dbError}</p>}

      {!dbError && posts.length === 0 && (
        <p className={styles.notice}>
          Todavía no has creado ninguna publicación. Empieza con «Nueva publicación»:
          lo que guardes aquí aparece de inmediato en la sección pública que elijas.
        </p>
      )}

      {posts.length > 0 && (
        <ul className={list.rows}>
          {posts.map((post) => {
            const section = sectionByKey(post.section);
            const subsection = subsectionByKey(post.subsection);
            const topic = post.topic
              ? section.topics.find((t) => t.slug === post.topic)
              : undefined;

            return (
              <li key={post.id} className={list.row}>
                <div className={list.main}>
                  <p className={list.path}>
                    {section.name} · {subsection.name}
                    {topic ? ` · ${topic.name}` : ""}
                  </p>
                  <h2 className={list.title}>{post.title}</h2>
                  {post.summary && <p className={list.summary}>{post.summary}</p>}
                </div>

                <div className={list.facts}>
                  <span className={post.published ? list.live : list.draft}>
                    {post.published ? "Visible" : "Oculta"}
                  </span>
                  <span>
                    {post.media.length}{" "}
                    {post.media.length === 1 ? "elemento" : "elementos"}
                  </span>
                  <span>{dateFormat.format(post.updatedAt)}</span>
                </div>

                <div className={list.actions}>
                  <Link href={`/admin/posts/${post.id}`} className={styles.secondary}>
                    Editar
                  </Link>
                  <Link
                    href={postHref(post.section, post.subsection, post.topic)}
                    className={styles.secondary}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver
                  </Link>
                  <DeletePostButton id={post.id} title={post.title} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
