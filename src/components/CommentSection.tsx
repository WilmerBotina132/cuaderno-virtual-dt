'use client';

import { useState } from 'react';
import styles from './CommentSection.module.scss';

interface Comment {
    id: number;
    author: string;
    text: string;
    date: string;
}

export default function CommentSection() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!author.trim() || !text.trim()) {
            setError('Por favor completa todos los campos.');
            return;
        }

        const newComment: Comment = {
            id: Date.now(),
            author: author.trim(),
            text: text.trim(),
            date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
        };

        setComments([...comments, newComment]);
        setAuthor('');
        setText('');
        setError('');
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Comentarios ({comments.length})</h2>

            <div className={styles.form}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Tu nombre"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <textarea
                    className={styles.textarea}
                    placeholder="Escribe tu comentario..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                />
                {error && <p className={styles.error}>{error}</p>}
                <button className={styles.button} onClick={handleSubmit}>
                    Publicar comentario
                </button>
            </div>

            <div className={styles.list}>
                {comments.length === 0 ? (
                    <p className={styles.empty}>Sé el primero en comentar.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <strong>{comment.author}</strong>
                                <time>{comment.date}</time>
                            </div>
                            <p>{comment.text}</p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}