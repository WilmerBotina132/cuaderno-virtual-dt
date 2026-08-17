import PostForm from "../../PostForm";
import styles from "../../admin.module.scss";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nueva publicación</h1>
        <span className={styles.pageMeta}>Se guarda en la sección que elijas</span>
      </div>

      <PostForm
        initialValues={{
          title: "",
          summary: "",
          body: "",
          section: "DISENO_APLICADO",
          subsection: "VIDEOS",
          topic: "",
          published: true,
          media: [],
        }}
      />
    </>
  );
}
