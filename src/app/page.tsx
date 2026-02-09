import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import postsData from '@/data/posts.json';
import styles from './page.module.scss';

export default function Home() {
  // Obtener los últimos 3 posts
  const latestPosts = postsData.slice(0, 3);

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Bienvenido a Mi Blog Personal
          </h1>
          <p className={styles.heroSubtitle}>
            Explorando el mundo del desarrollo web con Next.js, React y tecnologías modernas
          </p>
          <div className={styles.heroButtons}>
            <Link href="/blog" className="btn btn-primary">
              Ver todos los posts
            </Link>
            <Link href="/about" className="btn btn-secondary">
              Sobre mí
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="section">
        <div className="container">
          <h2 className={styles.sectionTitle}>Últimos Posts</h2>
          <div className={styles.postsGrid}>
            {latestPosts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                slug={post.slug}
                date={post.date}
                category={post.category}
                readTime={post.readTime}
              />
            ))}
          </div>
          <div className={styles.viewAll}>
            <Link href="/blog" className="btn btn-primary">
              Ver todos los posts →
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className={`section ${styles.aboutPreview}`}>
        <div className="container">
          <div className={styles.aboutContent}>
            <h2>¿Quién soy?</h2>
            <p>
              Soy un desarrollador apasionado por crear experiencias web increíbles.
              Me encanta compartir conocimiento y ayudar a otros a crecer en el mundo del desarrollo.
            </p>
            <Link href="/about" className="btn btn-secondary">
              Conoce más sobre mí
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
