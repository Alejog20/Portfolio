// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Referencias a Elementos del DOM ---
    const spotlight = document.querySelector('.effect__spotlight');
    // YA NO NECESITAMOS LA REFERENCIA AL ROBOT PARA TRANSFORMARLO
    // const robotViewer = document.querySelector('spline-viewer'); 
    const sectionsToAnimate = document.querySelectorAll('.hero, .section');

    // Variable para optimizar la animación del mouse
    let animationFrame;

    // --- Función para actualizar efectos visuales con el mouse ---
    function updateMouseEffects(e) {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(() => {
            if (spotlight) {
                // Posición del spotlight sigue al cursor
                const x = e.clientX;
                const y = e.clientY;
                spotlight.style.left = `${x}px`;
                spotlight.style.top = `${y}px`;
            }
            
            // =========================================================
            //  LA LÓGICA DE TRANSFORMACIÓN DEL ROBOT HA SIDO ELIMINADA
            // =========================================================
        });
    }

    // --- Función para el scroll suave de los enlaces del menú ---
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // --- Función para manejar la visibilidad de secciones al hacer scroll ---
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sectionsToAnimate.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // --- Inicialización de todas las funciones ---
    if (spotlight) {
        document.addEventListener('mousemove', updateMouseEffects);
    }
    
    setupSmoothScroll();
    setupIntersectionObserver();
});

// Pega esta función dentro de tu script.js

function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Opcional: Mostrar un estado de "Enviando..."
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        try {
            // Envía los datos a tu backend local
            const response = await fetch('http://127.0.0.1:8000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Éxito
                form.reset(); // Limpia el formulario
                submitButton.textContent = '¡Enviado!';
                setTimeout(() => { submitButton.textContent = 'Enviar Mensaje'; }, 2000);
            } else {
                // Error del servidor
                const errorResult = await response.json();
                alert(`Error: ${errorResult.detail || 'No se pudo enviar el mensaje.'}`);
                submitButton.textContent = 'Reintentar';
            }

        } catch (error) {
            // Error de red (ej. el backend no está funcionando)
            alert('Error de conexión. Asegúrate de que el servidor backend esté en ejecución.');
            submitButton.textContent = 'Reintentar';
        } finally {
             // Habilita el botón de nuevo (excepto si fue exitoso)
             if (submitButton.textContent !== '¡Enviado!') {
                submitButton.disabled = false;
             }
        }
    });
}

// Al final de tu script.js, dentro de DOMContentLoaded, añade la llamada a la función:

document.addEventListener('DOMContentLoaded', () => {
    // ... (el resto de tu código JS) ...

    // --- Inicialización de todas las funciones ---
    // ...
    setupContactForm(); // <--- AÑADE ESTA LÍNEA
});

// Pega esta función dentro de tu script.js

function setupAuroraEffect() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
}

// Y asegúrate de llamarla cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    // ... tus otras funciones (setupSmoothScroll, setupContactForm, etc.)
    setupAuroraEffect(); // <--- AÑADE ESTA LÍNEA
});

document.addEventListener('DOMContentLoaded', () => {

    // --- EFECTO "AURORA" EN TARJETAS ---
    // Posiciona una luz dentro de cada tarjeta relativa a la posición del cursor.
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Establece las variables CSS --x y --y en la tarjeta específica
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // --- ANIMACIÓN DE ENTRADA AL HACER SCROLL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hero, .section').forEach(el => {
        observer.observe(el);
    });

    // ... (Aquí iría tu función para manejar el formulario de contacto) ...
});

document.addEventListener('DOMContentLoaded', () => {

    // --- EFECTO "DESTELO DE CRISTAL" EN TARJETAS ---
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // --- ANIMACIÓN DE ENTRADA AL HACER SCROLL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hero, .section').forEach(el => {
        observer.observe(el);
    });
});


document.addEventListener('DOMContentLoaded', () => {

    // --- EFECTO "DESTELO DE CRISTAL" EN TARJETAS ---
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // ... (El resto de tu código JS, como el observer y el manejador del formulario)
});