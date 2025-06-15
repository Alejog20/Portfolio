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