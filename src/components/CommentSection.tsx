'use client';

// import { useState } from 'react';
// import styles from './CommentSection.module.scss';

/* 
 * EJERCICIO: Implementar sección de comentarios con React Hooks
 * 
 * CONCEPTOS A APRENDER:
 * - 'use client': Directiva para Client Components
 * - useState: Hook para manejar estado local
 * - Manejo de formularios en React
 * - Renderizado condicional
 * 
 * PASOS A SEGUIR:
 * 
 * 1. Crear el estado para los comentarios
 *    - Usar useState con un array de comentarios
 *    - Cada comentario debe tener: id, author, text, date
 * 
 * 2. Crear el estado para el formulario
 *    - Estado para el nombre del autor
 *    - Estado para el texto del comentario
 * 
 * 3. Implementar función para agregar comentario
 *    - Validar que los campos no estén vacíos
 *    - Crear nuevo comentario con ID único
 *    - Agregar al array de comentarios
 *    - Limpiar el formulario
 * 
 * 4. Crear el JSX:
 *    - Formulario para agregar comentario
 *    - Lista de comentarios existentes
 *    - Mensaje si no hay comentarios
 * 
 * 5. Crear estilos en CommentSection.module.scss
 */

interface Comment {
    id: number;
    author: string;
    text: string;
    date: string;
}

export default function CommentSection() {
    // TODO: Implementar useState para comentarios
    // const [comments, setComments] = useState<Comment[]>([]);

    // TODO: Implementar useState para el formulario
    // const [author, setAuthor] = useState('');
    // const [text, setText] = useState('');

    // TODO: Implementar función handleSubmit
    // const handleSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   // Validar campos
    //   // Crear nuevo comentario
    //   // Agregar a la lista
    //   // Limpiar formulario
    // };

    return (
        <div>
            <h3>Comentarios</h3>
            <p>TODO: Implementar sección de comentarios</p>

            {/* TODO: Agregar formulario */}
            {/* 
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Tu nombre"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea 
          placeholder="Tu comentario"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Agregar comentario</button>
      </form>
      */}

            {/* TODO: Mostrar lista de comentarios */}
            {/* 
      <div>
        {comments.length === 0 ? (
          <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id}>
              <strong>{comment.author}</strong>
              <p>{comment.text}</p>
              <small>{comment.date}</small>
            </div>
          ))
        )}
      </div>
      */}
        </div>
    );
}

/* PREGUNTAS PARA REFLEXIONAR:
 * 
 * 1. ¿Por qué necesitamos 'use client' en este archivo?
 *    Respuesta: Porque estamos usando useState, que es un hook de React
 *    que solo funciona en Client Components.
 * 
 * 2. ¿Qué pasa con los comentarios si refrescas la página?
 *    Respuesta: Se pierden, porque solo están en el estado local.
 *    Para persistirlos, necesitarías localStorage o una base de datos.
 * 
 * 3. ¿Cómo generas IDs únicos para los comentarios?
 *    Respuesta: Puedes usar Date.now(), o comments.length + 1, o una librería
 *    como uuid. Para este ejercicio, cualquier método simple funciona.
 */

/* BONUS: Persistir comentarios en localStorage
 * - Usar useEffect para cargar comentarios al montar
 * - Guardar en localStorage cada vez que cambian los comentarios
 * - Investigar el hook useLocalStorage (otro ejercicio)
 */
