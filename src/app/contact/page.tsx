// import { useState } from 'react';
// import styles from './page.module.scss';

/* 
 * EJERCICIO: Implementar formulario de contacto con validación
 * 
 * CONCEPTOS A APRENDER:
 * - Client Component con 'use client'
 * - useState para múltiples campos de formulario
 * - Validación de formularios
 * - Manejo de eventos
 * 
 * PASOS A SEGUIR:
 * 
 * 1. Agregar 'use client' al inicio del archivo
 * 
 * 2. Crear estados para el formulario:
 *    - name (nombre)
 *    - email (correo)
 *    - message (mensaje)
 *    - errors (objeto con errores de validación)
 *    - isSubmitted (boolean para mostrar mensaje de éxito)
 * 
 * 3. Implementar función de validación
 *    - Nombre: no vacío, mínimo 2 caracteres
 *    - Email: formato válido
 *    - Mensaje: no vacío, mínimo 10 caracteres
 * 
 * 4. Implementar handleSubmit
 *    - Validar campos
 *    - Si hay errores, mostrarlos
 *    - Si no hay errores, simular envío y mostrar mensaje de éxito
 * 
 * 5. Crear el JSX del formulario
 *    - Campos de input con valores controlados
 *    - Mostrar errores debajo de cada campo
 *    - Botón de envío
 *    - Mensaje de éxito condicional
 */

export default function ContactPage() {
    // TODO: Agregar 'use client' al inicio del archivo

    // TODO: Implementar estados
    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [message, setMessage] = useState('');
    // const [errors, setErrors] = useState<{name?: string; email?: string; message?: string}>({});
    // const [isSubmitted, setIsSubmitted] = useState(false);

    // TODO: Implementar función de validación
    // const validate = () => {
    //   const newErrors: any = {};
    //   
    //   if (!name || name.length < 2) {
    //     newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    //   }
    //   
    //   if (!email || !/\S+@\S+\.\S+/.test(email)) {
    //     newErrors.email = 'Por favor ingresa un email válido';
    //   }
    //   
    //   if (!message || message.length < 10) {
    //     newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    //   }
    //   
    //   return newErrors;
    // };

    // TODO: Implementar handleSubmit
    // const handleSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   const newErrors = validate();
    //   
    //   if (Object.keys(newErrors).length > 0) {
    //     setErrors(newErrors);
    //     return;
    //   }
    //   
    //   // Simular envío exitoso
    //   setErrors({});
    //   setIsSubmitted(true);
    //   
    //   // Limpiar formulario después de 3 segundos
    //   setTimeout(() => {
    //     setName('');
    //     setEmail('');
    //     setMessage('');
    //     setIsSubmitted(false);
    //   }, 3000);
    // };

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px' }}>
            <h1>Contacto</h1>
            <p>¿Tienes alguna pregunta o comentario? ¡Escríbeme!</p>

            <p style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                TODO: Implementar formulario de contacto con validación
            </p>

            {/* TODO: Agregar formulario aquí */}
            {/* 
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        
        <div>
          <label htmlFor="message">Mensaje</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
          {errors.message && <span className="error">{errors.message}</span>}
        </div>
        
        <button type="submit" className="btn btn-primary">
          Enviar mensaje
        </button>
        
        {isSubmitted && (
          <div className="success">
            ¡Mensaje enviado exitosamente! Te responderé pronto.
          </div>
        )}
      </form>
      */}
        </div>
    );
}

/* PREGUNTAS PARA REFLEXIONAR:
 * 
 * 1. ¿Por qué usar inputs controlados (controlled inputs)?
 *    Respuesta: Para que React maneje el estado del formulario, permitiendo
 *    validación en tiempo real y mejor control sobre los datos.
 * 
 * 2. ¿Qué es e.preventDefault() y por qué lo usamos?
 *    Respuesta: Previene el comportamiento por defecto del formulario (recargar
 *    la página), permitiéndonos manejar el submit con JavaScript.
 * 
 * 3. ¿Cómo mejorarías este formulario en producción?
 *    Respuesta: Conectarlo a una API real, agregar loading state, mejor UX
 *    con validación en tiempo real, usar una librería como react-hook-form.
 */

/* BONUS: Mejoras opcionales
 * 1. Validación en tiempo real (onChange)
 * 2. Loading state mientras se envía
 * 3. Conectar a una API real (API Routes de Next.js)
 * 4. Agregar más campos (teléfono, asunto, etc.)
 * 5. Usar una librería de validación como Zod o Yup
 */
