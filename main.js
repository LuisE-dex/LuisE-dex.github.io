// ---- CONFIGURACIÓN DEL FONDO CYBERNETIC (CANVAS) ----
function initCanvas() {
    const canvas = document.getElementById('cyber-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });

// Evitar que el navegador restaure la posición de scroll al recargar
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load', () => {
    // eliminar hash (para forzar inicio) y llevar al top
    try { history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) {}
    window.scrollTo(0, 0);
});

// Partículas
const numParticles = 65;
const particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = Math.random() * 0.8 + 0.2; // Caída hacia abajo
        this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Resetear si salen de los bordes
        if (this.y > height) {
            this.y = 0;
            this.x = Math.random() * width;
        }
        if (this.x < 0 || this.x > width) this.vx *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.fill();
    }
}

// Inicializar partículas
for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
}

// Lazo de Animación
function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Dibujar líneas de red tenues entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 - dist / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
            requestAnimationFrame(animate);
        }

        animate();
    }

    // Inicializar canvas cuando haya tiempo libre o en load (fallback)
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initCanvas, { timeout: 1000 });
    } else {
        window.addEventListener('load', () => setTimeout(initCanvas, 500));
    }


// ---- MANEJO ACTIVACIÓN NAVBAR (SCROLL) ----
const sections = document.querySelectorAll('section, header');
const navLi = document.querySelectorAll('.nav-links a');

// Mejora: determinar sección activa usando el punto central del viewport
window.addEventListener('scroll', () => {
    const scrollCenter = window.pageYOffset + window.innerHeight / 2;
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollCenter >= top && scrollCenter < bottom) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(a => {
        a.classList.remove('active');
        const href = a.getAttribute('href') || '';
        if (current && href.includes(`#${current}`)) {
            a.classList.add('active');
        }
    });
});

// Scroll suave con offset para navbar cuando se hace click en enlaces del nav
navLi.forEach(a => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const targetId = href.slice(1);
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        e.preventDefault();
        const navHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
        const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
        window.scrollTo({ top: targetY, behavior: 'smooth' });

        // cerrar menú móvil si está abierto
        if (navLinks && navLinks.classList.contains('open')) {
            menuToggle.classList.remove('open');
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// ---- MENU MÓVIL (HAMBURGUESA) ----
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    const open = menuToggle.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    // actualizar aria-expanded
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Cerrar menú al clicar un link (útil en móvil)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            menuToggle.classList.remove('open');
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Cerrar menú si el usuario cambia a vista desktop
function closeMobileMenu() {
    if (!menuToggle) return;
    if (navLinks.classList.contains('open')) {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// también cerrar al cargar en caso de que se refresque desde móvil a desktop
if (window.innerWidth > 768) closeMobileMenu();

// ---- ANIMACIONES AL SCROLL (INTERSECTION OBSERVER) ----
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateOnIntersect(entries, obs) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // aplicar brillo solo a objetivos definidos para evitar sombras en contenedores
            try {
                const glowSelectors = ['.btn', '.timeline-badge', '.social-links a', '.neon-text', '.logo'];
                const shouldGlow = glowSelectors.some(sel => entry.target.matches(sel) || entry.target.closest(sel));
                if (shouldGlow && !prefersReduced) entry.target.classList.add('glow-on-view');
            } catch (e) { /* safe */ }
            // si no queremos re-animar al salir, desconectamos
            obs.unobserve(entry.target);
        }
    });
}

const observer = new IntersectionObserver(animateOnIntersect, observerOptions);

// Marcar elementos para animar: variamos origen según sección/posición
document.querySelectorAll('.section, .hero-content, .timeline-item, .about-card, .contact-card, .skills-grid img').forEach((el, i) => {
    el.classList.add('anim-item');
    // alternar estilos para mayor dinamismo
    const variants = ['from-left','from-right','from-top','from-bottom','spin-in','pop-in'];
    el.classList.add(variants[i % variants.length]);
    observer.observe(el);
});

// ---- INTRO 'WOW' ON LOAD ----
const introOverlay = document.getElementById('intro-overlay');
const skipIntroBtn = document.getElementById('skip-intro');

function hideIntro() {
    if (!introOverlay) return;
    introOverlay.classList.add('intro-hide');
    // permitir scroll otra vez
    document.body.style.overflow = '';
    // after animation, remove from DOM flow
    setTimeout(() => {
        if (introOverlay && introOverlay.parentNode) introOverlay.parentNode.removeChild(introOverlay);
    }, 700);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!introOverlay) return;
    // Si el usuario prefiere menos movimiento, eliminamos la intro inmediatamente
    if (prefersReduced) {
        if (introOverlay && introOverlay.parentNode) introOverlay.parentNode.removeChild(introOverlay);
        document.body.style.overflow = '';
        return;
    }

    // bloquear scroll mientras la intro está activa
    document.body.style.overflow = 'hidden';
    // auto cerrar después de X ms para efecto WOW
    const AUTO_CLOSE_MS = 3000;
    const autoClose = setTimeout(hideIntro, AUTO_CLOSE_MS);

    // permitir saltar
    if (skipIntroBtn) skipIntroBtn.addEventListener('click', () => { clearTimeout(autoClose); hideIntro(); });

    // cerrar con click en overlay y con Escape
    introOverlay.addEventListener('click', (e) => {
        if (e.target === introOverlay) { clearTimeout(autoClose); hideIntro(); }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { clearTimeout(autoClose); hideIntro(); } });
});

// Al terminar la intro, queremos que las animaciones del contenido no hayan sido observadas prematuramente.