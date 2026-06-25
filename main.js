// ---- CONFIGURACIÓN DEL FONDO CYBERNETIC (CANVAS) ----
const canvas = document.getElementById('cyber-bg');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
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


// ---- MANEJO ACTIVACIÓN NAVBAR (SCROLL) ----
const sections = document.querySelectorAll('section, header');
const navLi = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
});