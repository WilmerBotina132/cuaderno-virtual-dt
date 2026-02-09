# 📚 Blog Personal Educativo - Next.js

Proyecto educativo diseñado para enseñar conceptos fundamentales de Next.js 14 a través de la construcción de un blog personal.

## 🎯 Objetivos de Aprendizaje

Este proyecto cubre los siguientes conceptos:

- ✅ **Sistema de Rutas (App Router)**: Rutas estáticas y dinámicas
- ✅ **Layouts**: Root layout y nested layouts
- ✅ **Rendering Strategies**: CSR, SSR y SSG
- ✅ **Data Fetching**: Obtención de datos en Server Components
- ✅ **React Hooks**: useState, useEffect y custom hooks
- ✅ **SCSS**: Estilos con CSS Modules y SCSS
- ✅ **TypeScript**: Tipado estático para mayor seguridad

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn
- Editor de código (VS Code recomendado)

### Pasos para comenzar

1. **Instalar dependencias**
   ```bash
   cd personal-blog
   npm install
   ```

2. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
personal-blog/
├── app/                          # App Router de Next.js
│   ├── layout.tsx               # ✅ Root layout (COMPLETO)
│   ├── page.tsx                 # ✅ Home page (COMPLETO)
│   ├── page.module.scss         # ✅ Estilos del home
│   ├── globals.scss             # ✅ Estilos globales
│   ├── blog/
│   │   ├── page.tsx             # 🟡 Lista de posts (PARCIAL)
│   │   └── [slug]/
│   │       └── page.tsx         # 🔴 Post individual (TODO)
│   ├── about/
│   │   └── page.tsx             # 🔴 Sobre mí (TODO)
│   └── contact/
│       └── page.tsx             # 🔴 Contacto (TODO)
├── src/
│   ├── components/
│   │   ├── Header.tsx           # ✅ Navegación (COMPLETO)
│   │   ├── Footer.tsx           # ✅ Footer (COMPLETO)
│   │   ├── BlogCard.tsx         # 🟡 Card de post (PARCIAL)
│   │   ├── CommentSection.tsx   # 🔴 Comentarios (TODO)
│   │   └── ThemeToggle.tsx      # 🔴 Toggle tema (TODO)
│   ├── styles/
│   │   ├── _variables.scss      # ✅ Variables SCSS
│   │   ├── _mixins.scss         # ✅ Mixins reutilizables
│   │   └── _typography.scss     # 🟡 Tipografía (PARCIAL)
│   ├── data/
│   │   ├── posts.json           # ✅ Datos de posts
│   │   └── author.json          # ✅ Datos del autor
│   └── hooks/
│       └── useLocalStorage.tsx  # 🔴 Custom hook (TODO)
├── public/                       # Archivos estáticos
├── README.md                     # Este archivo
└── EJERCICIOS.md                 # Guía de ejercicios
```

### Leyenda
- ✅ **COMPLETO**: Archivo funcional para estudiar
- 🟡 **PARCIAL**: Estructura base, estudiantes completan
- 🔴 **TODO**: Estudiantes implementan desde cero

## 📖 Conceptos Clave

### 1. App Router
Next.js 14 usa el App Router con la carpeta `app/`. Cada carpeta representa una ruta:
- `app/page.tsx` → `/`
- `app/blog/page.tsx` → `/blog`
- `app/blog/[slug]/page.tsx` → `/blog/cualquier-slug`

### 2. Server vs Client Components
- **Server Components** (por defecto): Se ejecutan en el servidor, no envían JS al cliente
- **Client Components** (`'use client'`): Permiten interactividad, hooks, eventos

### 3. Rendering Strategies
- **SSG** (Static Site Generation): Genera HTML en build time
- **SSR** (Server-Side Rendering): Genera HTML en cada request
- **CSR** (Client-Side Rendering): Renderiza en el navegador

### 4. SCSS y CSS Modules
- Archivos `.module.scss` son CSS Modules (scoped por componente)
- Variables y mixins en `src/styles/`
- Estilos globales en `app/globals.scss`

## 🎓 Ejercicios para Estudiantes

Ver el archivo [EJERCICIOS.md](./EJERCICIOS.md) para la guía completa de ejercicios.

### Ejercicios Principales

1. **Página de Post Individual (SSG)** - `app/blog/[slug]/page.tsx`
   - Implementar `generateStaticParams`
   - Renderizar contenido del post
   - Conceptos: SSG, dynamic routes

2. **Página Sobre Mí (SSR)** - `app/about/page.tsx`
   - Mostrar información del autor
   - Conceptos: SSR, Server Components

3. **Sección de Comentarios** - `src/components/CommentSection.tsx`
   - Usar useState para manejar comentarios
   - Conceptos: Client Components, useState

4. **Toggle de Tema** - `src/components/ThemeToggle.tsx`
   - Implementar tema claro/oscuro
   - Conceptos: useState, useEffect, localStorage

5. **Formulario de Contacto** - `app/contact/page.tsx`
   - Validación de formulario
   - Conceptos: useState, validación, eventos

6. **Custom Hook** - `src/hooks/useLocalStorage.tsx`
   - Hook para persistir datos
   - Conceptos: Custom hooks, localStorage

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación
npm start            # Inicia servidor de producción

# Linting
npm run lint         # Ejecuta ESLint
```

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [SCSS Guide](https://sass-lang.com/guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Consejos para Estudiantes

1. **Lee los comentarios TODO**: Cada archivo tiene instrucciones detalladas
2. **Estudia los archivos COMPLETOS**: Son ejemplos de buenas prácticas
3. **Experimenta**: No tengas miedo de romper cosas y aprender
4. **Usa la consola**: `console.log()` es tu amigo
5. **Lee los errores**: Los mensajes de error son muy informativos

## 🤝 Contribuir

Este es un proyecto educativo. Siéntete libre de:
- Mejorar los ejercicios
- Agregar más ejemplos
- Corregir errores
- Sugerir mejoras

## 📝 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

**¡Feliz aprendizaje! 🚀**
