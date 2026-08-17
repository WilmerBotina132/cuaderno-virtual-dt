import Image from "next/image";
import type { MediaItem } from "@prisma/client";

import { linkHost } from "@/lib/media";
import type { PostWithMedia } from "@/lib/posts";
import { youtubeEmbedUrl } from "@/lib/youtube";

import Reveal from "./Reveal";
import Sheet from "./Sheet";
import styles from "./PostList.module.scss";

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** Un video, una foto o un archivo dentro de la publicacion. */
function MediaFrame({ item }: { item: MediaItem }) {
  if (item.kind === "YOUTUBE") {
    const embed = youtubeEmbedUrl(item.url);
    if (!embed) return null;
    return (
      <figure className={styles.frame}>
        <div className={styles.videoBox}>
          <iframe
            src={embed}
            title={item.label ?? "Video de apoyo"}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {item.label && <figcaption className={styles.caption}>{item.label}</figcaption>}
      </figure>
    );
  }

  if (item.kind === "VIDEO_UPLOAD") {
    return (
      <figure className={styles.frame}>
        <video className={styles.player} controls preload="metadata" playsInline>
          <source src={item.url} />
          Tu navegador no puede reproducir este video.{" "}
          <a href={item.url}>Ábrelo en una pestaña nueva.</a>
        </video>
        {item.label && <figcaption className={styles.caption}>{item.label}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className={styles.frame}>
      <a
        className={styles.photo}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        title="Ver la imagen en tamaño completo"
      >
        <Image
          src={item.url}
          alt={item.label ?? "Imagen de la publicación"}
          fill
          sizes="(min-width: 46rem) 45vw, 92vw"
          className={styles.photoImg}
        />
      </a>
      {item.label && <figcaption className={styles.caption}>{item.label}</figcaption>}
    </figure>
  );
}

function PostCard({ post }: { post: PostWithMedia }) {
  const links = post.media.filter((m) => m.kind === "LINK");
  const frames = post.media.filter((m) => m.kind !== "LINK");
  const images = frames.filter((m) => m.kind === "IMAGE");
  const players = frames.filter((m) => m.kind !== "IMAGE");

  return (
    <Sheet as="article" id={post.slug} className={styles.card} framed>
      <div className={styles.inner}>
        <div className={styles.meta}>
          <time dateTime={post.publishedAt.toISOString()}>
            {dateFormat.format(post.publishedAt)}
          </time>
          {frames.length > 0 && (
            <span>
              {frames.length} {frames.length === 1 ? "archivo" : "archivos"}
            </span>
          )}
        </div>

        <h2 className={styles.title}>{post.title}</h2>
        {post.summary && <p className={styles.summary}>{post.summary}</p>}
        {post.body && <div className={styles.body}>{post.body}</div>}

        {players.length > 0 && (
          <div className={styles.players}>
            {players.map((item) => (
              <MediaFrame key={item.id} item={item} />
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className={styles.gallery}>
            {images.map((item) => (
              <MediaFrame key={item.id} item={item} />
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div className={styles.links}>
            <p className={styles.linksTitle}>Enlaces</p>
            <ul>
              {links.map((item) => (
                <li key={item.id}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <span className={styles.linkHost}>{linkHost(item.url)}</span>
                    <span className={styles.linkLabel}>{item.label ?? item.url}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Sheet>
  );
}

export default function PostList({ posts }: { posts: PostWithMedia[] }) {
  return (
    <div className={styles.list}>
      {posts.map((post, index) => (
        <Reveal key={post.id} delay={Math.min(index, 4) * 0.05}>
          <PostCard post={post} />
        </Reveal>
      ))}
    </div>
  );
}
