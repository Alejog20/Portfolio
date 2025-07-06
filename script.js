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

/**
 * MÓDULO 6: ROBOT INTERACTION HINT
 * Manages the custom interaction hint for the 3D robot, hiding Spline watermark
 * and providing user guidance for the interactive experience.
 /**
 * MÓDULO 6: ROBOT INTERACTION HINT - ENHANCED VERSION
 * Advanced watermark detection and hiding with dynamic positioning
 */
function setupRobotInteractionHint() {
    console.log("Módulo de interacción con robot iniciado - Versión Avanzada.");
    
    const robotContainer = document.querySelector('.hero__robot-container');
    const splineViewer = document.querySelector('.hero__robot-3d');
    const interactionHint = document.getElementById('robotHint');
    
    // Early return if elements aren't found
    if (!robotContainer || !splineViewer) {
        console.warn("Advertencia: No se encontraron los elementos del robot en esta página.");
        return;
    }
    
    if (!interactionHint) {
        console.warn("Advertencia: Elemento hint no encontrado. Verifica que agregaste el HTML del hint.");
        return;
    }
    
    // State management variables
    let hasInteracted = false;
    let hintHideTimeout;
    let isSplineLoaded = false;
    let watermarkDetectionAttempts = 0;
    let mutationObserver = null;
    
    /**
     * Advanced Spline loading detection with multiple fallback methods
     */
    function waitForSplineLoad() {
        const maxAttempts = 50; // 10 seconds total
        
        // Multiple detection methods for Spline loading
        const detectionMethods = [
            () => splineViewer.shadowRoot,
            () => splineViewer.contentDocument,
            () => splineViewer.querySelector('canvas'),
            () => splineViewer.children.length > 0,
            () => getComputedStyle(splineViewer).height !== '0px'
        ];
        
        const isLoaded = detectionMethods.some(method => {
            try {
                return method();
            } catch (e) {
                return false;
            }
        });
        
        if (isLoaded || watermarkDetectionAttempts > maxAttempts) {
            isSplineLoaded = true;
            initializeWatermarkHiding();
            initializeInteractionTracking();
            console.log("🤖 Spline cargado completamente. Iniciando detección de watermark.");
        } else {
            watermarkDetectionAttempts++;
            setTimeout(waitForSplineLoad, 200);
        }
    }
    
    /**
     * Comprehensive watermark detection and hiding system
     */
    function initializeWatermarkHiding() {
        // Method 1: Direct shadow DOM access
        hideWatermarkDirectAccess();
        
        // Method 2: CSS injection with multiple selectors
        injectWatermarkHidingCSS();
        
        // Method 3: Dynamic overlay positioning
        createDynamicWatermarkOverlay();
        
        // Method 4: Mutation observer for dynamic changes
        setupWatermarkMutationObserver();
        
        // Method 5: Aggressive periodic checking
        startPeriodicWatermarkCheck();
    }
    
    /**
     * Method 1: Direct shadow DOM watermark removal
     */
    function hideWatermarkDirectAccess() {
        try {
            if (splineViewer.shadowRoot) {
                const possibleSelectors = [
                    '[class*="logo"]',
                    '[class*="watermark"]',
                    '[class*="brand"]',
                    '[id*="logo"]',
                    '[id*="watermark"]',
                    'a[href*="spline"]',
                    'div[style*="position: absolute"][style*="bottom"]',
                    '[data-testid*="logo"]'
                ];
                
                possibleSelectors.forEach(selector => {
                    const elements = splineViewer.shadowRoot.querySelectorAll(selector);
                    elements.forEach(el => {
                        if (el.textContent.toLowerCase().includes('spline') || 
                            el.textContent.toLowerCase().includes('built with')) {
                            el.style.display = 'none !important';
                            el.style.visibility = 'hidden !important';
                            el.style.opacity = '0 !important';
                            console.log("✅ Watermark encontrado y ocultado via shadow DOM:", selector);
                        }
                    });
                });
            }
        } catch (error) {
            console.log("⚠️ Acceso directo al shadow DOM no disponible:", error.message);
        }
    }
    
    /**
     * Method 2: Advanced CSS injection for watermark hiding
     */
    function injectWatermarkHidingCSS() {
        const style = document.createElement('style');
        style.id = 'spline-watermark-eliminator';
        style.textContent = `
            /* Hide various Spline watermark possibilities */
            .hero__robot-3d spline-viewer::part(logo),
            .hero__robot-3d spline-viewer::part(watermark),
            .hero__robot-3d spline-viewer::part(brand) {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
            
            /* Aggressive watermark overlay */
            .hero__robot-3d {
                position: relative !important;
            }
            
            .hero__robot-3d::before {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 80px;
                background: linear-gradient(to top, 
                    var(--color-background) 0%, 
                    var(--color-background) 40%,
                    rgba(7, 0, 7, 0.95) 70%,
                    transparent 100%);
                pointer-events: none;
                z-index: 12;
            }
            
            /* Additional overlay for stubborn watermarks */
            .watermark-killer-overlay {
                position: absolute !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                height: 100px !important;
                background: linear-gradient(to top, 
                    var(--color-background) 0%, 
                    var(--color-background) 30%,
                    rgba(7, 0, 7, 0.98) 60%,
                    rgba(7, 0, 7, 0.7) 80%,
                    transparent 100%) !important;
                pointer-events: none !important;
                z-index: 15 !important;
            }
        `;
        
        if (!document.getElementById('spline-watermark-eliminator')) {
            document.head.appendChild(style);
            console.log("💉 CSS avanzado para ocultar watermark inyectado.");
        }
    }
    
    /**
     * Method 3: Dynamic overlay that adapts to watermark position
     */
    function createDynamicWatermarkOverlay() {
        // Remove existing overlay if present
        const existingOverlay = robotContainer.querySelector('.watermark-killer-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Create new dynamic overlay
        const overlay = document.createElement('div');
        overlay.className = 'watermark-killer-overlay';
        overlay.style.cssText = `
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 100px !important;
            background: linear-gradient(to top, 
                var(--color-background) 0%, 
                var(--color-background) 30%,
                rgba(7, 0, 7, 0.98) 60%,
                rgba(7, 0, 7, 0.7) 80%,
                transparent 100%) !important;
            pointer-events: none !important;
            z-index: 15 !important;
        `;
        
        robotContainer.appendChild(overlay);
        console.log("🎯 Overlay dinámico anti-watermark creado.");
    }
    
    /**
     * Method 4: Mutation observer to catch dynamic watermark appearances
     */
    function setupWatermarkMutationObserver() {
        if (mutationObserver) {
            mutationObserver.disconnect();
        }
        
        mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if added node contains watermark-like content
                        const textContent = node.textContent || '';
                        if (textContent.toLowerCase().includes('spline') || 
                            textContent.toLowerCase().includes('built with')) {
                            node.style.display = 'none !important';
                            console.log("🔍 Mutation observer ocultó elemento:", textContent);
                        }
                    }
                });
            });
        });
        
        // Observe the robot container and spline viewer
        mutationObserver.observe(robotContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        if (splineViewer.shadowRoot) {
            mutationObserver.observe(splineViewer.shadowRoot, {
                childList: true,
                subtree: true
            });
        }
        
        console.log("👁️ Mutation observer configurado para detectar watermarks dinámicos.");
    }
    
    /**
     * Method 5: Periodic watermark checking and elimination
     */
    function startPeriodicWatermarkCheck() {
        const checkInterval = setInterval(() => {
            // Re-apply hiding methods periodically
            hideWatermarkDirectAccess();
            
            // Ensure overlay remains positioned correctly
            const overlay = robotContainer.querySelector('.watermark-killer-overlay');
            if (!overlay) {
                createDynamicWatermarkOverlay();
            }
            
            // Stop checking after user interaction or 30 seconds
            if (hasInteracted || Date.now() - startTime > 30000) {
                clearInterval(checkInterval);
                console.log("🔄 Verificación periódica de watermark finalizada.");
            }
        }, 1000);
        
        const startTime = Date.now();
    }
    
    /**
     * Enhanced interaction tracking with better detection
     */
    function initializeInteractionTracking() {
        // Mouse interaction detection
        robotContainer.addEventListener('mousedown', handleUserInteraction);
        robotContainer.addEventListener('touchstart', handleUserInteraction);
        
        // Enhanced drag detection
        let isMouseDown = false;
        let dragThreshold = 5; // pixels
        let startX, startY;
        
        robotContainer.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.clientX;
            startY = e.clientY;
        });
        
        robotContainer.addEventListener('mouseup', () => isMouseDown = false);
        
        robotContainer.addEventListener('mousemove', (e) => {
            if (isMouseDown && !hasInteracted) {
                const deltaX = Math.abs(e.clientX - startX);
                const deltaY = Math.abs(e.clientY - startY);
                
                if (deltaX > dragThreshold || deltaY > dragThreshold) {
                    handleUserInteraction();
                }
            }
        });
        
        // Enhanced touch gesture detection
        let touchStartX, touchStartY;
        
        robotContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        robotContainer.addEventListener('touchmove', (e) => {
            if (!hasInteracted && touchStartX && touchStartY) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                const deltaX = Math.abs(touchX - touchStartX);
                const deltaY = Math.abs(touchY - touchStartY);
                
                if (deltaX > 10 || deltaY > 10) {
                    handleUserInteraction();
                }
            }
        });
        
        console.log("🎯 Sistema de detección de interacción mejorado configurado.");
    }
    
    /**
     * Handle user interaction and cleanup
     */
    function handleUserInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;
            hideInteractionHint();
            sessionStorage.setItem('robotInteractionCompleted', 'true');
            
            // Cleanup observers
            if (mutationObserver) {
                mutationObserver.disconnect();
            }
            
            console.log("👤 Usuario interactuó con el robot. Sistemas de hint y detección desactivados.");
        }
    }
    
    /**
     * Enhanced hint hiding with cleanup
     */
    function hideInteractionHint() {
        if (interactionHint) {
            interactionHint.classList.add('hint-hidden');
            setTimeout(() => {
                if (interactionHint && interactionHint.parentNode) {
                    interactionHint.style.display = 'none';
                }
            }, 800);
        }
    }
    
    /**
     * Show interaction hint with improved positioning
     */
    function showInteractionHint() {
        // Check if user already interacted
        if (sessionStorage.getItem('robotInteractionCompleted')) {
            interactionHint.style.display = 'none';
            console.log("ℹ️ Usuario ya interactuó previamente. Hint ocultado.");
            return;
        }
        
        // Dynamic hint texts with more variety
        const hintTexts = [
            'Arrastra para explorar',
            'Haz clic y arrastra',
            'Explora el robot 3D',
            'Mueve para ver más',
            'Interactúa conmigo',
            'Toca y explora'
        ];
        
        const randomText = hintTexts[Math.floor(Math.random() * hintTexts.length)];
        const hintTextElement = interactionHint.querySelector('.hint-text');
        if (hintTextElement) {
            hintTextElement.textContent = randomText;
        }
        
        // Enhanced hint positioning to ensure it's above any watermark
        interactionHint.style.zIndex = '20';
        interactionHint.style.position = 'absolute';
        
        // Auto-hide after 15 seconds
        hintHideTimeout = setTimeout(() => {
            if (!hasInteracted) {
                hideInteractionHint();
                console.log("⏰ Hint auto-ocultado después de 15 segundos.");
            }
        }, 15000);
        
        console.log("💡 Hint mejorado mostrado con texto:", randomText);
    }
    
    /**
     * Responsive behavior handling
     */
    function handleResponsiveHint() {
        const isMobile = window.innerWidth <= 768;
        const hintTextElement = interactionHint.querySelector('.hint-text');
        
        if (isMobile && hintTextElement) {
            hintTextElement.textContent = 'Toca y arrastra';
        }
    }
    
    // Initialize the complete system
    waitForSplineLoad();
    handleResponsiveHint();
    
    // Show hint after ensuring everything is loaded
    setTimeout(() => {
        if (isSplineLoaded && interactionHint) {
            showInteractionHint();
        }
    }, 3000);
    
    // Handle window resize
    window.addEventListener('resize', handleResponsiveHint);
    
    console.log("🚀 Sistema completo de interacción con robot inicializado.");
}

    // --- INICIALIZACIÓN DE TODOS LOS MÓDULOS ---
    setupStarfield();
    setupTypewriter();
    setupGlassEffect();
    setupContactForm(); // <-- Llamamos a la nueva función del formulario
    setupProjectCarousels(); 
    setupRobotInteractionHint(); // <-- Add this new line here

});