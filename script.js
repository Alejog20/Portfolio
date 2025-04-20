document.addEventListener('DOMContentLoaded', () => {
    const spotlight = document.querySelector('.spotlight');
    const robotViewer = document.querySelector('spline-viewer');
    let animationFrame;

    // Función para actualizar efectos visuales
    function updateEffects(e) {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(() => {
            // Actualizar posición del spotlight
            const x = e.clientX;
            const y = e.clientY + window.scrollY;
            spotlight.style.left = `${x}px`;
            spotlight.style.top = `${y}px`;
            
            // Seguimiento del robot
            if (robotViewer) {
                const rect = robotViewer.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // Cálculo mejorado de ángulos para movimiento más natural
                const angleX = (e.clientY - centerY) / window.innerHeight * 25;
                const angleY = (e.clientX - centerX) / window.innerWidth * 25;
                
                // Aplicar transformación con perspectiva
                robotViewer.style.transform = `
                    perspective(1000px)
                    rotateX(${-angleX}deg)
                    rotateY(${angleY}deg)
                `;
            }
        });
    }

    // Manejar movimiento del mouse
    document.addEventListener('mousemove', updateEffects);

    // Manejar scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Función para manejar la visibilidad de secciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
});