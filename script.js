document.addEventListener('DOMContentLoaded', () => {

    // --- Bottom Navigation Active State ---
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    const sections = document.querySelectorAll('section, header');

    const navObserverOptions = {
        threshold: 0.3
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                bottomNavItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // --- Canvas Starfield Background ---
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        };

        class Star {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * 2 + 0.5;
                this.size = Math.random() * 1.5;
                this.opacity = Math.random();
                this.velocity = (Math.random() * 0.2 + 0.05) * (3 - this.z);
            }
            update() {
                this.y -= this.velocity;
                if (this.y < 0) {
                    this.y = height;
                    this.x = Math.random() * width;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initStars() {
            stars = [];
            const starCount = Math.floor((width * height) / 4000);
            for (let i = 0; i < starCount; i++) {
                stars.push(new Star());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            // Subtle gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#050a18'); // Updated to new dark cosmic
            gradient.addColorStop(1, '#000000');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            stars.forEach(star => {
                star.update();
                star.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // --- Scroll Observer for Fade-ins ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Handle Progress Bars
                if (entry.target.classList.contains('skill-category') || entry.target.querySelector('.fill')) {
                    const bars = entry.target.querySelectorAll('.fill');
                    bars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        if (targetWidth) {
                            bar.style.width = targetWidth;
                        }
                    });
                }
            }
        });
    }, observerOptions);

    // Initialize Elements
    const animateElements = document.querySelectorAll('.timeline-item, .skill-category, .planet-orbit, .tool-card, .info-card');
    animateElements.forEach(el => {
        el.classList.add('hidden-scroll');
        observer.observe(el);
    });

    // Initialize Progress Bars (Set to 0 first)
    const progressBars = document.querySelectorAll('.fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.setAttribute('data-width', width);
        bar.style.width = '0%';
    });

    // --- Parallax Effect ---
    // Only apply on larger screens or check performance
    const heroContent = document.querySelector('.hero-content');
    if (window.matchMedia("(min-width: 768px)").matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
                heroContent.style.opacity = 1 - (scrolled / 600);
            }
        });
    }
});

// CSS Injection for Animation Classes
const styleCheck = document.createElement('style');
styleCheck.innerHTML = `
    .hidden-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    .visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(styleCheck);

// script.js এর resize ফাংশনে এটি যোগ করুন
function initStars() {
    stars = [];
    // মোবাইলে স্টারের সংখ্যা কম রাখা (Performance Fix)
    const density = window.innerWidth < 768 ? 8000 : 4000;
    const starCount = Math.floor((width * height) / density);
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
}

