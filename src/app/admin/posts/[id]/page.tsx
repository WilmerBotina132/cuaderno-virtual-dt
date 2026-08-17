import { notFound } from "next/navigation";

import { getPostById } from "@/lib/posts";
import type { MediaKindValue } from "@/lib/media";

import PostForm from "../../PostForm";
import styles from "../../admin.module.scss";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Editar publicación</h1>
        <span className={styles.pageMeta}>{post.slug}</span>
      </div>

      <PostForm
        postId={post.id}
        initialValues={{
          title: post.title,
          summary: post.summary ?? "",
          body: post.body ?? "",
          section: post.section,
          subsection: post.subsection,
          topic: post.topic ?? "",
          published: post.published,
          media: post.media.map((item) => ({
            key: item.id,
            kind: item.kind as MediaKindValue,
            url: item.url,
            label: item.label ?? "",
            blobPathname: item.blobPathname,
            sizeBytes: item.sizeBytes,
          })),
        }}
      />
    </>
  );
}
