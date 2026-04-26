'use client';

import { useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import styles from './ThemeToggle.module.scss';

export default function ThemeToggle() {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return (
        <button className={styles.toggle} onClick={toggle} aria-label="Cambiar tema">
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
}