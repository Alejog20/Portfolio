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
/**
 * MÓDULO 5 CORREGIDO: CAROUSEL DE PROYECTOS
 * Solo crea flechas dentro de las tarjetas de proyecto
 */
    function setupProjectCarousels() {
        // IMPORTANTE: Solo seleccionar carouseles dentro de la sección de proyectos
        const projectCards = document.querySelectorAll('.proyectos .proyecto-card');


        projectCards.forEach(card => {
            const slides = card.querySelectorAll('.carousel-slide');
            const indicators = card.querySelectorAll('.indicator');
            
            // Buscar botones existentes en HTML O crearlos si no existen
            let nextBtn = card.querySelector('.carousel-nav--next');
            let prevBtn = card.querySelector('.carousel-nav--prev');
            
            // Si no existen en HTML, crearlos (pero SOLO dentro de la tarjeta)
            if (!nextBtn) {
                nextBtn = document.createElement('button');
                nextBtn.className = 'carousel-nav carousel-nav--next';
                nextBtn.innerHTML = '›';
                nextBtn.setAttribute('aria-label', 'Next slide');
                card.appendChild(nextBtn);
            }
            
            if (!prevBtn) {
                prevBtn = document.createElement('button');
                prevBtn.className = 'carousel-nav carousel-nav--prev';
                prevBtn.innerHTML = '‹';
                prevBtn.setAttribute('aria-label', 'Previous slide');
                card.appendChild(prevBtn);
            }

            let currentIndex = 0;

            if (slides.length <= 1) return; // No setup carousel if only one slide

            function showSlide(index) {
                if (index >= slides.length) {
                    currentIndex = 0;
                } else if (index < 0) {
                    currentIndex = slides.length - 1;
                } else {
                    currentIndex = index;
                }

                slides.forEach((slide, i) => {
                    slide.classList.remove('active');
                    if (i === currentIndex) {
                        slide.classList.add('active');
                    }
                });

                indicators.forEach((indicator, i) => {
                    indicator.classList.remove('active');
                    if (i === currentIndex) {
                        indicator.classList.add('active');
                    }
                });
            }

            // Event listeners para las flechas
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevenir propagación
                showSlide(currentIndex + 1);
            });

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevenir propagación
                showSlide(currentIndex - 1);
            });
            
            indicators.forEach(indicator => {
                indicator.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                    showSlide(slideIndex);
                });
            });

            // Initialize the first slide
            showSlide(currentIndex);
        });
    }

    /**
     * MÓDULO 6: SIMPLE SPLINE WATERMARK HIDING
     * Uses container cropping to hide watermark without interfering with 3D rendering
     */
   /**
     * MÓDULO 6: MEJORADO SPLINE WATERMARK HIDING CON TAMAÑO PRESERVADO
     * Usa transform scale para mantener el tamaño original del robot mientras oculta la marca de agua
     */
    function setupImprovedWatermarkHiding() {
        console.log("🎯 Iniciando ocultación mejorada de marca de agua...");
        
        const robotContainer = document.querySelector('.hero__robot-container');
        const splineViewer = document.querySelector('.hero__robot-3d');
        
        if (!robotContainer || !splineViewer) {
            console.warn("⚠️ Contenedores del robot no encontrados");
            return;
        }

        // Esperar a que Spline se cargue antes de aplicar las mejoras
        setTimeout(() => {
            applyImprovedWatermarkHiding();
        }, 2000);

        function applyImprovedWatermarkHiding() {
            console.log("✨ Aplicando ocultación mejorada con tamaño preservado...");
            
            // 🔧 AQUÍ PUEDES AJUSTAR LOS VALORES PARA CONTROLAR EL CORTE:
            const SCALE_FACTOR = 1.22;      // Aumenta para ocultar más marca de agua (1.1 a 1.3 recomendado)
            const TRANSLATE_Y = 5;        // Ajusta para posicionar el robot (-4 a -12 rango típico)
            
            // Calcular cuánto se está cortando para mostrar en consola
            const effectiveCut = ((SCALE_FACTOR - 1) * 100) + Math.abs(TRANSLATE_Y);
            console.log(`📏 Cortando ${effectiveCut.toFixed(1)}% de la parte inferior para ocultar marca de agua`);
            
            // Aplicar estilos mejorados que preservan el tamaño mientras ocultan la marca de agua
            robotContainer.style.cssText += `
                overflow: hidden !important;
                position: relative !important;
                /* Mantener ancho y alto originales para preservar el tamaño */
                width: 100% !important;
                height: 100% !important;
            `;
            
            // Escalar y posicionar el visor para ocultar marca de agua manteniendo el tamaño del robot
            splineViewer.style.cssText += `
                width: 100% !important;
                height: 100% !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                /* Usar transform scale para agrandar el visor, empujando la marca de agua fuera de vista */
                transform: scale(${SCALE_FACTOR}) translateY(${TRANSLATE_Y}%) !important;
                transform-origin: center center !important;
            `;
            
            // Agregar CSS comprensivo para ocultar cualquier marca de agua de Spline
            const watermarkHidingStyle = document.createElement('style');
            watermarkHidingStyle.id = 'improved-watermark-hiding';
            watermarkHidingStyle.textContent = `
                /* Ocultar todos los posibles elementos de marca de agua de Spline */
                .hero__robot-3d a[href*="spline"],
                .hero__robot-3d [class*="logo"],
                .hero__robot-3d [id*="logo"],
                .hero__robot-3d [class*="watermark"],
                .hero__robot-3d [class*="branding"] {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                }
                
                /* Asegurar que el contenedor mantenga buenas proporciones */
                .hero__robot-container {
                    min-height: 400px !important;
                    max-height: 650px !important;
                }
                
                /* Asegurar que el robot siga siendo interactivo y se renderice correctamente */
                .hero__robot-3d {
                    pointer-events: auto !important;
                    user-select: none !important;
                    -webkit-user-select: none !important;
                }
                
                /* Ocultar cualquier elemento posicionado en la parte inferior que pueda ser marca de agua */
                .hero__robot-3d *[style*="bottom"],
                .hero__robot-3d *[style*="position: absolute"]:last-child {
                    display: none !important;
                }
            `;
            
            if (!document.getElementById('improved-watermark-hiding')) {
                document.head.appendChild(watermarkHidingStyle);
                console.log("🎨 Estilos mejorados de ocultación aplicados");
            }
            
            console.log("✅ Ocultación mejorada completada - robot mantiene tamaño original");
        }
    }


    /**
     * MÓDULO 7: FLECHAS DE INTERACCIÓN DEL ROBOT
     * Crea indicadores de flecha permanentes que muestran a los usuarios que pueden rotar el robot
     */
    function setupRobotInteractionArrows() {
        console.log("🏹 Configurando flechas de interacción del robot...");
        
        const robotContainer = document.querySelector('.hero__robot-container');
        
        if (!robotContainer) {
            console.warn("⚠️ Contenedor del robot no encontrado para las flechas");
            return;
        }

        // Esperar a que el robot esté completamente cargado antes de agregar las flechas
        setTimeout(() => {
            createInteractionArrows();
        }, 3000);

        function createInteractionArrows() {
            // Crear flecha izquierda
            const leftArrow = document.createElement('div');
            leftArrow.className = 'robot-interaction-arrow robot-interaction-arrow--left';
            leftArrow.innerHTML = '&#8249;'; // Símbolo de flecha izquierda
            
            // Crear flecha derecha  
            const rightArrow = document.createElement('div');
            rightArrow.className = 'robot-interaction-arrow robot-interaction-arrow--right';
            rightArrow.innerHTML = '&#8250;'; // Símbolo de flecha derecha
            
            // Agregar flechas al contenedor
            robotContainer.appendChild(leftArrow);
            robotContainer.appendChild(rightArrow);
            
            // Agregar estilos de las flechas
            const arrowStyles = document.createElement('style');
            arrowStyles.id = 'robot-interaction-arrows-styles';
            arrowStyles.textContent = `
                /* Estilos base de las flechas */
                .robot-interaction-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: rgba(255, 255, 255, 0.7);
                    
                    z-index: 1000;
                    pointer-events: none;
                    user-select: none;
                    
                    transition: all 0.3s ease;
                    
                    /* Efecto de brillo sutil */
                    text-shadow: 
                        0 0 10px rgba(255, 255, 255, 0.3),
                        0 0 20px rgba(138, 43, 226, 0.2);
                    
                    /* Animación */
                    animation: arrowPulse 2s ease-in-out infinite;
                }
                
                /* Posicionamiento de flecha izquierda */
                .robot-interaction-arrow--left {
                    left: 15%;
                    animation-delay: 0s;
                }
                
                /* Posicionamiento de flecha derecha */
                .robot-interaction-arrow--right {
                    right: 15%;
                    animation-delay: 1s;
                }
                
                /* Animación de pulso para llamar la atención */
                @keyframes arrowPulse {
                    0%, 100% { 
                        opacity: 0.7; 
                        transform: translateY(-50%) scale(1);
                    }
                    50% { 
                        opacity: 1; 
                        transform: translateY(-50%) scale(1.1);
                    }
                }
                
                /* Estado transparente cuando el usuario está interactuando */
                .robot-interaction-arrow.interacting {
                    opacity: 0.2 !important;
                    animation-play-state: paused;
                }
                
                /* Efecto hover para mouse cercano */
                .robot-interaction-arrow:hover {
                    opacity: 1;
                    transform: translateY(-50%) scale(1.2);
                }
                
                /* Ajustes responsivos */
                @media (max-width: 768px) {
                    .robot-interaction-arrow {
                        font-size: 2rem;
                    }
                    
                    .robot-interaction-arrow--left {
                        left: 8%;
                    }
                    
                    .robot-interaction-arrow--right {
                        right: 8%;
                    }
                }
                
                @media (max-width: 480px) {
                    .robot-interaction-arrow {
                        font-size: 1.5rem;
                    }
                    
                    .robot-interaction-arrow--left {
                        left: 5%;
                    }
                    
                    .robot-interaction-arrow--right {
                        right: 5%;
                    }
                }
            `;
            
            if (!document.getElementById('robot-interaction-arrows-styles')) {
                document.head.appendChild(arrowStyles);
                console.log("🎨 Estilos de flechas aplicados");
            }
            
            // Configurar detección de interacción para hacer las flechas transparentes
            setupArrowInteractionDetection();
            
            console.log("✅ Flechas de interacción creadas exitosamente");
        }

        function setupArrowInteractionDetection() {
            const arrows = robotContainer.querySelectorAll('.robot-interaction-arrow');
            let isInteracting = false;
            let interactionTimeout;

            // Función para hacer las flechas transparentes durante la interacción
            function setArrowsInteracting(interacting) {
                arrows.forEach(arrow => {
                    if (interacting) {
                        arrow.classList.add('interacting');
                    } else {
                        arrow.classList.remove('interacting');
                    }
                });
                isInteracting = interacting;
            }

            // Detección de interacción con mouse
            robotContainer.addEventListener('mousedown', () => {
                setArrowsInteracting(true);
                console.log("🖱️ Interacción con mouse detectada - flechas transparentes");
            });

            robotContainer.addEventListener('mouseup', () => {
                // Esperar antes de hacer las flechas visibles de nuevo
                clearTimeout(interactionTimeout);
                interactionTimeout = setTimeout(() => {
                    setArrowsInteracting(false);
                    console.log("🖱️ Interacción con mouse terminada - flechas visibles");
                }, 1000);
            });

            // Detección de interacción táctil  
            robotContainer.addEventListener('touchstart', () => {
                setArrowsInteracting(true);
                console.log("👆 Interacción táctil detectada - flechas transparentes");
            });

            robotContainer.addEventListener('touchend', () => {
                clearTimeout(interactionTimeout);
                interactionTimeout = setTimeout(() => {
                    setArrowsInteracting(false);
                    console.log("👆 Interacción táctil terminada - flechas visibles");
                }, 1000);
            });

            // Movimiento del mouse durante arrastre
            let isDragging = false;
            robotContainer.addEventListener('mousedown', () => {
                isDragging = true;
            });

            robotContainer.addEventListener('mouseup', () => {
                isDragging = false;
            });

            robotContainer.addEventListener('mousemove', () => {
                if (isDragging) {
                    setArrowsInteracting(true);
                    clearTimeout(interactionTimeout);
                    interactionTimeout = setTimeout(() => {
                        if (!isDragging) {
                            setArrowsInteracting(false);
                        }
                    }, 1000);
                }
            });

            console.log("🎯 Sistema de detección de interacción configurado");
        }
    }

    /**
     * MÓDULO 8: ROBOT INTERACTION HINT
     * Shows a simple hint for user interaction
     */
    function setupRobotInteractionHint() {
        console.log("💫 Configurando pista de interacción...");
        
        const robotContainer = document.querySelector('.hero__robot-container');
        const interactionHint = document.getElementById('robotHint');
        
        if (!robotContainer || !interactionHint) {
            console.warn("⚠️ Elementos de interacción no encontrados");
            return;
        }
        
        let hasInteracted = false;
        
        // Position the hint
        interactionHint.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            padding: 8px 16px;
            background: rgba(75, 0, 130, 0.12);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            font-size: 0.8rem;
            color: var(--color-text-title);
            z-index: 999999;
            opacity: 0;
            transition: opacity 0.4s ease;
        `;
        
        // Show hint after a delay
        setTimeout(() => {
            if (!sessionStorage.getItem('robotInteractionCompleted')) {
                interactionHint.style.opacity = '1';
                interactionHint.textContent = 'Arrastra para explorar';
                
                // Hide after 10 seconds
                setTimeout(() => {
                    if (!hasInteracted) {
                        interactionHint.style.opacity = '0';
                    }
                }, 10000);
            }
        }, 3000);
        
        // Hide hint on interaction
        const handleInteraction = () => {
            if (!hasInteracted) {
                hasInteracted = true;
                interactionHint.style.opacity = '0';
                sessionStorage.setItem('robotInteractionCompleted', 'true');
                console.log("👤 Usuario interactuó con el robot");
            }
        };
        
        robotContainer.addEventListener('mousedown', handleInteraction);
        robotContainer.addEventListener('touchstart', handleInteraction);
    }

    // --- INICIALIZACIÓN DE TODOS LOS MÓDULOS ---
    setupStarfield();
    setupTypewriter();
    setupGlassEffect();
    setupContactForm();
    setupProjectCarousels();
    setupImprovedWatermarkHiding(); // ✅ Improved watermark hiding with preserved size
    setupRobotInteractionArrows();  // ✅ Interactive arrows for user guidance
    setupRobotInteractionHint();    

    console.log("🚀 Todos los módulos inicializados correctamente");
});


document.addEventListener('DOMContentLoaded', () => {
    // Eliminar flechas del hero de forma agresiva
    setTimeout(() => {
        const heroArrows = document.querySelectorAll('.hero .carousel-nav, .hero .carousel-nav--prev, .hero .carousel-nav--next');
        heroArrows.forEach(arrow => {
            if (arrow) {
                arrow.remove(); // Eliminar completamente del DOM
            }
        });
        console.log('🗑️ Flechas del hero eliminadas del DOM');
    }, 1000);
});


/* MÓDULO DE LIMPIEZA FINAL */
document.addEventListener('DOMContentLoaded', () => {
    // Esperamos un segundo para asegurarnos de que todos los scripts han corrido
    setTimeout(() => {
        // Seleccionamos CUALQUIER flecha de carrusel dentro del hero
        const rogueArrows = document.querySelectorAll('.hero .carousel-nav');
        
        if (rogueArrows.length > 0) {
            console.log(`[Limpieza] Encontradas y eliminadas ${rogueArrows.length} flechas rebeldes.`);
            rogueArrows.forEach(arrow => {
                arrow.remove(); // ¡Eliminada del DOM para siempre!
            });
        }
    }, 1000);
});