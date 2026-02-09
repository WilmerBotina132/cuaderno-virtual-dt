'use client';

// import { useState, useEffect } from 'react';
// import styles from './ThemeToggle.module.scss';

/* 
 * EJERCICIO: Implementar toggle de tema claro/oscuro con React Hooks
 * 
 * CONCEPTOS A APRENDER:
 * - useState: Manejo de estado
 * - useEffect: Efectos secundarios y sincronización
 * - localStorage: Persistencia de datos en el navegador
 * - Manipulación del DOM
 * 
 * PASOS A SEGUIR:
 * 
 * 1. Crear estado para el tema
 *    - useState con valores 'light' o 'dark'
 *    - Valor inicial desde localStorage o 'light'
 * 
 * 2. Implementar función toggle
 *    - Cambiar entre 'light' y 'dark'
 *    - Guardar preferencia en localStorage
 * 
 * 3. Usar useEffect para aplicar el tema
 *    - Agregar/remover clase 'dark' al body
 *    - Ejecutar cuando cambie el tema
 * 
 * 4. Crear el JSX del botón
 *    - Icono de sol/luna según el tema
 *    - Texto descriptivo
 * 
 * 5. Crear estilos en ThemeToggle.module.scss (opcional)
 */

export default function ThemeToggle() {
    // TODO: Implementar useState para el tema
    // const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // TODO: Implementar useEffect para cargar tema desde localStorage
    // useEffect(() => {
    //   const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    //   if (savedTheme) {
    //     setTheme(savedTheme);
    //   }
    // }, []);

    // TODO: Implementar useEffect para aplicar el tema al body
    // useEffect(() => {
    //   if (theme === 'dark') {
    //     document.body.classList.add('dark');
    //   } else {
    //     document.body.classList.remove('dark');
    //   }
    // }, [theme]);

    // TODO: Implementar función toggleTheme
    // const toggleTheme = () => {
    //   const newTheme = theme === 'light' ? 'dark' : 'light';
    //   setTheme(newTheme);
    //   localStorage.setItem('theme', newTheme);
    // };

    return (
        <button>
            TODO: Implementar toggle de tema
            {/* TODO: Mostrar icono según el tema */}
            {/* {theme === 'light' ? '🌙' : '☀️'} */}
        </button>
    );
}

/* PREGUNTAS PARA REFLEXIONAR:
 * 
 * 1. ¿Por qué necesitamos dos useEffect diferentes?
 *    Respuesta: Uno para cargar el tema inicial (se ejecuta una vez al montar),
 *    y otro para aplicar el tema cada vez que cambia.
 * 
 * 2. ¿Qué pasa si no usamos useEffect para aplicar el tema?
 *    Respuesta: El tema no se aplicaría al DOM. useState solo maneja el estado
 *    de React, pero no modifica el DOM directamente.
 * 
 * 3. ¿Por qué guardar en localStorage?
 *    Respuesta: Para recordar la preferencia del usuario entre sesiones.
 *    Sin localStorage, el tema se resetearía al recargar la página.
 */

/* BONUS: Mejorar el componente
 * 1. Agregar transición suave al cambiar de tema
 * 2. Detectar preferencia del sistema con window.matchMedia
 * 3. Usar CSS variables para los colores del tema
 * 4. Agregar animación al botón
 */

/* NOTA SOBRE CSS:
 * Para que funcione el tema oscuro, necesitas agregar estilos CSS:
 * 
 * body.dark {
 *   background-color: #1f2937;
 *   color: #f9fafb;
 * }
 * 
 * O mejor aún, usar CSS variables que cambien según la clase .dark
 */
