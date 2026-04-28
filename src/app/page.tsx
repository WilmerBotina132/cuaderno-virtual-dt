import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import postsData from '@/data/posts.json';
import authorData from '@/data/author.json';
import styles from './page.module.scss';

export default function HomePage() {
    const recentPosts = postsData.slice(0, 3);

    return (
        <main>
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heroTitle}>Hola, soy <span>{authorData.name}</span></h1>
                    <p className={styles.heroSubtitle}>{authorData.bio}</p>
                    <div className={styles.heroActions}>
                        <Link href="/blog" className={styles.btnPrimary}>Ver apuntes</Link>
                        <Link href="/about" className={styles.btnSecondary}>Sobre mí</Link>
                    </div>
                </div>
            </section>

            <section className={styles.recentPosts}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Apuntes Recientes</h2>
                    <div className={styles.postsGrid}>
                        {recentPosts.map((post) => (
                            <BlogCard
                                key={post.id}
                                title={post.title}
                                excerpt={post.excerpt}
                                slug={post.slug}
                                date={post.date}
                                category={post.category}
                                readTime={post.readTime}
                                author={post.author}
                            />
                        ))}
                    </div>
                    <div className={styles.viewAll}>
                        <Link href="/blog" className={styles.btnPrimary}>Ver todos los apuntes</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}