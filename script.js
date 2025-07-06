document.addEventListener('DOMContentLoaded', () => {

    /**
     * MÓDULO 1: FONDO DE ESTRELLAS CON CANVAS
     * Anima un campo de estrellas en 3D para el fondo de la página.
     */
    function setupStarfield() {
        const canvas = document.getElementById('starfield-canvas');
        if (!canvas) {
            console.error('Canvas element with id "starfield-canvas" not found.');
            return;
        }

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
                const px = star.x * k + canvas.width / 2 - canvas.width / 2 * k;
                const py = star.y * k + canvas.height / 2 - canvas.height / 2 * k;

                if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
                    const size = star.size * k;
                    const twinkle = Math.random() > 0.995 ? 0.5 : 1;
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

    /**
     * MÓDULO 2: EFECTO DE TECLADO (TYPEWRITER)
     * Anima el título principal para que aparezca como si se estuviera escribiendo.
     */
    function setupTypewriter() {
        const titleElement = document.querySelector('.hero__title');
        if (titleElement) {
            const textToType = titleElement.getAttribute('data-text-original') || titleElement.textContent.trim();
            if (!textToType) return;
            
            titleElement.setAttribute('data-text-original', textToType);
            let i = 0;
            titleElement.textContent = '';
            titleElement.classList.add('typing-effect');
            
            function type() {
                if (i < textToType.length) {
                    titleElement.textContent += textToType.charAt(i);
                    i++;
                    setTimeout(type, 180);
                } else {
                    titleElement.classList.remove('typing-effect');
                    titleElement.classList.add('typing-done');
                }
            }
            type();
        }
    }

    /**
     * MÓDULO 3: EFECTO DE VIDRIO EN TARJETAS
     * Crea un reflejo de luz que sigue al mouse sobre las tarjetas con la clase '.card'.
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
     * MÓDULO 4: MANEJO DEL FORMULARIO DE CONTACTO
     * Captura el envío del formulario, lo envía al backend y da feedback al usuario.
     */
    function setupContactForm() {
        console.log("Módulo de formulario iniciado.");

        const contactForm = document.getElementById('contact-form');
        if (!contactForm) {
            console.warn("Advertencia: No se encontró el formulario con el ID 'contact-form' en esta página.");
            return;
        }

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log("Formulario enviado. Previniendo recarga.");

            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            const formData = new FormData(contactForm);
            const data = {
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                asunto: formData.get('asunto'),
                mensaje: formData.get('mensaje')
            };

            console.log("Datos a enviar:", data);
            
            // Asegúrate de que esta URL sea la correcta para tu despliegue en Vercel
            const apiUrl = 'https://portfolio-taupe-eight-43.vercel.app/api/contact';

            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then(response => {
                console.log("Respuesta del servidor recibida. Status:", response.status);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
                }
            })
            .then(result => {
                console.log("Éxito:", result);
                alert('¡Mensaje enviado exitosamente!');
                contactForm.reset();
            })
            .catch(error => {
                console.error("Error en la petición fetch:", error);
                alert(`Hubo un error al enviar el mensaje: ${error.message}.`);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar mensaje';
            });
        });
    }

    /**
     * MÓDULO 5: CAROUSEL DE PROYECTOS
     * Controla la navegación de slides dentro de cada tarjeta de proyecto.
     */
    function setupProjectCarousels() {
        const projectCards = document.querySelectorAll('.proyecto-card');

        projectCards.forEach(card => {
            const slides = card.querySelectorAll('.carousel-slide');
            const indicators = card.querySelectorAll('.indicator');
            const nextBtn = card.querySelector('.carousel-nav--next');
            const prevBtn = card.querySelector('.carousel-nav--prev');
            let currentIndex = 0;

            if (slides.length <= 1) return; // Don't setup carousel if only one slide

            function showSlide(index) {
                // Ensure index is within bounds
                if (index >= slides.length) {
                    currentIndex = 0;
                } else if (index < 0) {
                    currentIndex = slides.length - 1;
                } else {
                    currentIndex = index;
                }

                // Update slides
                slides.forEach((slide, i) => {
                    slide.classList.remove('active');
                    if (i === currentIndex) {
                        slide.classList.add('active');
                    }
                });

                // Update indicators
                indicators.forEach((indicator, i) => {
                    indicator.classList.remove('active');
                    if (i === currentIndex) {
                        indicator.classList.add('active');
                    }
                });
            }

            nextBtn.addEventListener('click', () => {
                showSlide(currentIndex + 1);
            });

            prevBtn.addEventListener('click', () => {
                showSlide(currentIndex - 1);
            });
            
            indicators.forEach(indicator => {
                indicator.addEventListener('click', (e) => {
                    const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                    showSlide(slideIndex);
                });
            });

            // Initialize the first slide
            showSlide(currentIndex);
        });
    }

    // --- INICIALIZACIÓN DE TODOS LOS MÓDULOS ---
    setupStarfield();
    setupTypewriter();
    setupGlassEffect();
    setupContactForm(); // <-- Llamamos a la nueva función del formulario
    setupProjectCarousels(); 
});