import Link from 'next/link';
import Image from 'next/image';
import styles from './BlogCard.module.scss';

interface BlogCardProps {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    category: string;
    readTime: string;
    author?: string;
    image?: string;
    tags?: string[];
}

export default function BlogCard({ title, excerpt, slug, date, category, readTime, author, image, tags }: BlogCardProps) {
    return (
        <article className={styles.card}>
            {image && (
                <div className={styles.imageWrapper}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            )}

            <div className={styles.body}>
                <div className={styles.header}>
                    <span className={styles.category}>{category}</span>
                    <span className={styles.readTime}>{readTime}</span>
                </div>

                <h3 className={styles.title}>
                    <Link href={`/blog/${slug}`}>
                        {title}
                    </Link>
                </h3>

                <p className={styles.excerpt}>{excerpt}</p>

                {tags && tags.length > 0 && (
                    <div className={styles.tags}>
                        {tags.map((tag) => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                )}

                <div className={styles.footer}>
                    <div className={styles.meta}>
                        <time className={styles.date}>{new Date(date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</time>
                        {author && <span className={styles.author}>· {author}</span>}
                    </div>

                    <Link href={`/blog/${slug}`} className={styles.readMore}>
                        Leer más →
                    </Link>
                </div>
            </div>
        </article>
    );
}