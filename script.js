
document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * MÓDULO 1: FONDO DE ESTRELLAS
     */
    function setupStarfield() {
        const canvas = document.getElementById('starfield-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let stars = [];
        const STAR_COUNT = 2500;
        const speed = 0.2;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: Math.random() * canvas.width,
                    size: Math.random() * 1.5 + 0.3
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
                const px = star.x * k + canvas.width / 2 - (canvas.width / 2 * k);
                const py = star.y * k + canvas.height / 2 - (canvas.height / 2 * k);

                if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
                    const size = star.size * k;
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() > 0.995 ? 0.5 : 1})`;
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

    /**
     * MÓDULO 2: CARRUSEL DE PROYECTOS
     * Selector corregido para apuntar a '.proyecto-card__carousel'
     */
    function setupProjectCarousels() {
        const carousels = document.querySelectorAll('.proyecto-card__carousel');

        carousels.forEach(carousel => {
            const slides = carousel.querySelectorAll('.carousel-slide');
            const indicators = carousel.querySelectorAll('.indicator');
            const nextBtn = carousel.querySelector('.carousel-nav--next');
            const prevBtn = carousel.querySelector('.carousel-nav--prev');
            
            if (slides.length <= 1) {
                if(nextBtn) nextBtn.style.display = 'none';
                if(prevBtn) prevBtn.style.display = 'none';
                const indicatorContainer = carousel.querySelector('.carousel-indicators');
                if (indicatorContainer) indicatorContainer.style.display = 'none';
                return;
            }

            let currentIndex = 0;

            function showSlide(index) {
                currentIndex = (index + slides.length) % slides.length;
                slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
                indicators.forEach((indicator, i) => indicator.classList.toggle('active', i === currentIndex));
            }

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(currentIndex + 1);
            });

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(currentIndex - 1);
            });
            
            indicators.forEach(indicator => {
                indicator.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showSlide(parseInt(e.target.dataset.slide));
                });
            });

            showSlide(0);
        });
    }

    /**
     * MÓDULO 3: NAVBAR MÓVIL
     */
    function setupMobileNav() {
        const toggleButton = document.getElementById('mobileNavToggle');
        const mobileMenu = document.getElementById('mobileNavMenu');
        const body = document.body;

        if (!toggleButton || !mobileMenu) return;
        const icon = toggleButton.querySelector('i');

        const toggleMenu = () => {
            const isOpen = body.classList.toggle('mobile-menu-open');
            icon.className = isOpen ? 'ri-close-line' : 'ri-menu-line';
        };

        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target.matches('.header__link')) {
                toggleMenu();
            }
        });
    }

    // --- INICIALIZACIÓN DE TODOS LOS MÓDULOS ---
    setupStarfield();
    setupProjectCarousels();
    setupMobileNav();
    // Los otros módulos (setupTypewriter, setupGlassEffect, setupContactForm) pueden ir aquí si los necesitas.
    console.log("🚀 Todos los módulos del sistema inicializados correctamente.");
});