document.addEventListener('DOMContentLoaded', () => {

    /**
     * =================================================
     * MÓDULO 1: EFECTO DE TECLADO (TYPEWRITER)
     * =================================================
     */
    function setupTypewriter() {
        const titleElement = document.querySelector('.hero__title');
        if (titleElement) {
            const textToType = titleElement.textContent.trim();
            let i = 0;
            titleElement.textContent = '';
            titleElement.classList.add('typing-effect');

            function type() {
                if (i < textToType.length) {
                    titleElement.textContent += textToType.charAt(i);
                    i++;
                    setTimeout(type, 100); // Velocidad de escritura
                } else {
                    titleElement.classList.remove('typing-effect');
                    titleElement.classList.add('typing-done');
                }
            }
            type();
        }
    }

    /**
     * =================================================
     * MÓDULO 2: EFECTO DE VIDRIO EN TARJETAS
     * =================================================
     */
    function setupGlassEffect() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    /**
     * =================================================
     * MÓDULO 3: FONDO DE ESTRELLAS CON CANVAS
     * =================================================
     * (Este módulo asume que tienes un <canvas id="starfield-canvas"> en tu HTML)
     */
    function setupStarfield() {
        const canvas = document.getElementById('starfield-canvas'); // Asegúrate de tener este id en tu HTML
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const STAR_COUNT = 2000;
        const speed = 0.2;
        let stars = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: Math.random() * canvas.width,
                    size: Math.random() * 1.2 + 0.3
                });
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let star of stars) {
                star.z -= speed;
                if (star.z <= 0) {
                    star.z = canvas.width;
                }

                const k = 128 / star.z;
                const px = star.x * k + canvas.width / 2 - canvas.width / 2 * k;
                const py = star.y * k + canvas.height / 2 - canvas.height / 2 * k;
                
                if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
                    const size = star.size * k;
                    const twinkle = Math.random() > 0.99 ? 0.5 : 1;
                    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

    // --- INICIALIZACIÓN DE TODOS LOS MÓDULOS ---
    setupTypewriter();
    setupGlassEffect();
    setupStarfield();
    
    // Aquí podrías añadir otras funciones como setupSmoothScroll() o setupContactForm() si las necesitas.
});