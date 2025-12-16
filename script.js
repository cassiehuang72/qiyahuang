// ========================================
// Animated Background with Particles
// ========================================
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 2;
            this.y -= Math.sin(angle) * force * 2;
        }

        // Boundary check
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(42, 42, 42, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const numberOfParticles = (canvas.width * canvas.height) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(42, 42, 42, ${0.1 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ========================================
// Scroll Indicator Functionality
// ========================================
const scrollIndicator = document.getElementById('scroll-indicator');

scrollIndicator.addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

// Hide scroll indicator when scrolled
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
    } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
    }
});

// ========================================
// Navigation Scroll Effect
// ========================================
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ========================================
// Fade-in Sections on Scroll
// ========================================
const fadeInSections = document.querySelectorAll('.fade-in-section');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

fadeInSections.forEach(section => {
    observer.observe(section);
});

// ========================================
// Page Navigation System
// ========================================
const pages = {
    'home': 'home-page',
    'about': 'about-page',
    'work': 'work-page',
    'contact': 'contact-page',
    'project-vr': 'project-vr-page',
    'project-cv': 'project-cv-page',
    'project-3d': 'project-3d-page',
    'project-data': 'project-data-page',
    'project-web': 'project-web-page',
    'project-ai': 'project-ai-page'
};

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show requested page
    const page = document.getElementById(pages[pageId] || pageId);
    if (page) {
        page.classList.add('active');
        window.scrollTo(0, 0);
        
        // Re-observe fade-in sections on new page
        const newFadeInSections = page.querySelectorAll('.fade-in-section');
        newFadeInSections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Handle navigation clicks
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('href').substring(1);
        showPage(pageId);
        
        // Update URL without page reload
        history.pushState({page: pageId}, '', `#${pageId}`);
    });
});

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
    const pageId = location.hash.substring(1) || 'home';
    showPage(pageId);
});

// Load correct page on initial load
window.addEventListener('load', () => {
    const pageId = location.hash.substring(1) || 'home';
    showPage(pageId);
});

// ========================================
// Smooth Cursor Effect (Optional Enhancement)
// ========================================
let cursorDot = null;
let cursorOutline = null;

// Only add custom cursor on desktop
if (window.innerWidth > 768) {
    cursorDot = document.createElement('div');
    cursorOutline = document.createElement('div');
    
    cursorDot.style.cssText = `
        width: 8px;
        height: 8px;
        background: #2a2a2a;
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.15s ease;
    `;
    
    cursorOutline.style.cssText = `
        width: 30px;
        height: 30px;
        border: 1px solid #2a2a2a;
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.15s ease;
    `;
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Smooth follow for dot
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        
        // Slower follow for outline
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
        cursorOutline.style.left = outlineX - 15 + 'px';
        cursorOutline.style.top = outlineY - 15 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Scale up on hover
    document.querySelectorAll('a, button, .project-card').forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(1.5)';
            cursorOutline.style.transform = 'scale(1.5)';
        });
        elem.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1)';
            cursorOutline.style.transform = 'scale(1)';
        });
    });
}