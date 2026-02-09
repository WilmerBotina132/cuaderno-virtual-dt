import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.section}>
                        <h3>Mi Blog Personal</h3>
                        <p>Compartiendo conocimiento sobre desarrollo web y tecnología.</p>
                    </div>

                    <div className={styles.section}>
                        <h4>Enlaces</h4>
                        <nav className={styles.links}>
                            <Link href="/">Inicio</Link>
                            <Link href="/blog">Blog</Link>
                            <Link href="/about">Sobre Mí</Link>
                            <Link href="/contact">Contacto</Link>
                        </nav>
                    </div>

                    <div className={styles.section}>
                        <h4>Redes Sociales</h4>
                        <div className={styles.social}>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                GitHub
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                Twitter
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {currentYear} Mi Blog Personal. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
