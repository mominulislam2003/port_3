document.addEventListener('DOMContentLoaded', () => {
    // Navigation handling
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    const sections = document.querySelectorAll('section, header');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                bottomNavItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.3 });
    sections.forEach(s => navObserver.observe(s));

    // Form handling
    const form = document.getElementById("my-form");
    const status = document.getElementById("status");
    const rocket = document.getElementById("rocket-container");
    const submitBtn = document.getElementById("submit-btn");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            submitBtn.innerText = "Ignition...";
            status.innerText = "Sending...";
            status.style.color = "var(--accent)";

            try {
                const res = await fetch(e.target.action, {
                    method: 'POST',
                    body: new FormData(e.target),
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    rocket.classList.add("launching");
                    submitBtn.innerText = "Sent into Orbit!";
                    setTimeout(() => {
                        status.innerText = "Message is send successfully!";
                        rocket.classList.remove("launching");
                        submitBtn.innerText = "Send Message";
                        form.reset();
                    }, 2000);
                } else { throw new Error(); }
            } catch {
                status.innerText = "Oops! Submission failed.";
                status.style.color = "var(--error)"; // Using CSS variable instead of 'red'
                submitBtn.innerText = "Try Again";
            }
        });
    }

    // Background Canvas
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, stars = [];
        const init = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            stars = [];
            const count = width < 768 ? 50 : 150;
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 1.5,
                    opacity: Math.random() * 0.8 + 0.2,
                    speed: Math.random() * 0.3 + 0.1
                });
            }
        };
        const draw = () => {
            ctx.fillStyle = '#050a18';
            ctx.fillRect(0, 0, width, height);
            stars.forEach(s => {
                s.y -= s.speed;
                if (s.y < 0) s.y = height;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
                ctx.fill();
            });
            requestAnimationFrame(draw);
        };
        window.addEventListener('resize', init);
        init();
        draw();
    }

    // Scroll Animations
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.hidden-scroll, .glass-card, .timeline-item').forEach(el => scrollObserver.observe(el));

    const homeContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight && homeContent) {
            homeContent.style.opacity = 1 - scrolled / 600;
            homeContent.style.transform = `translateY(${scrolled * 0.25}px)`;
        }
    }, { passive: true });

    // Interactive Cursor & Starry Trail
    class StarTrail {
        constructor() {
            this.stars = [];
            this.cursor = { x: -100, y: -100 };
            this.outline = { x: -100, y: -100 };
            this.cursorDot = document.getElementById('custom-cursor');
            this.cursorOutline = document.getElementById('cursor-outline');

            // Optimization: check if pointer is coarse (touch devices)
            const isTouch = window.matchMedia('(pointer: coarse)').matches;
            if (!this.cursorDot || !this.cursorOutline || isTouch) {
                if (this.cursorDot) this.cursorDot.style.display = 'none';
                if (this.cursorOutline) this.cursorOutline.style.display = 'none';
                return;
            }

            this.init();
        }

        init() {
            window.addEventListener('mousemove', (e) => {
                this.cursor.x = e.clientX;
                this.cursor.y = e.clientY;

                // Move dot immediately
                this.cursorDot.style.left = `${this.cursor.x}px`;
                this.cursorDot.style.top = `${this.cursor.y}px`;

                // Create stars with slight throttle/randomness
                if (Math.random() > 0.2) {
                    this.createStar(e.clientX, e.clientY);
                }
            });

            // Hover effects for all interactive elements
            const updateInteractiveElements = () => {
                const interactiveElements = document.querySelectorAll('a, button, .photo-card, .glass-card, .nav-item, input, textarea, .social-pill, .logo, .game-tag, .btn-primary');
                interactiveElements.forEach(el => {
                    if (el.dataset.cursorBound) return;
                    el.addEventListener('mouseenter', () => this.cursorOutline.classList.add('hover'));
                    el.addEventListener('mouseleave', () => this.cursorOutline.classList.remove('hover'));
                    el.dataset.cursorBound = "true";
                });
            };

            updateInteractiveElements();

            // Performance Fix: Use MutationObserver instead of setInterval
            const observer = new MutationObserver((mutations) => {
                updateInteractiveElements();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            this.animate();
        }

        createStar(x, y) {
            const star = document.createElement('div');
            star.className = 'star-particle';

            const size = Math.random() * 3 + 2; // 2px to 5px
            const isAccent = Math.random() > 0.5;
            const color = isAccent ? 'var(--accent)' : '#ffffff';
            const lifetime = Math.random() * 700 + 800; // 0.8s to 1.5s

            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = color;
            star.style.boxShadow = `0 0 ${size * 2}px ${color}`;
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;

            // Random float direction (Zero Gravity)
            const vx = (Math.random() - 0.5) * 2;
            const vy = (Math.random() - 0.5) * 2;

            document.body.appendChild(star);

            const startTime = performance.now();

            const updateStar = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = elapsed / lifetime;

                if (progress >= 1) {
                    star.remove();
                    return;
                }

                const opacity = 1 - progress;
                const scale = 1 - Math.pow(progress, 2); // Faster shrink at end
                const currentX = x + vx * progress * 50;
                const currentY = y + vy * progress * 50;

                star.style.opacity = opacity;
                star.style.transform = `translate(-50%, -50%) scale(${scale})`;
                star.style.left = `${currentX}px`;
                star.style.top = `${currentY}px`;

                requestAnimationFrame(updateStar);
            };

            requestAnimationFrame(updateStar);
        }

        animate() {
            // Smooth lag effect for the outer ring
            const easing = 0.15;
            this.outline.x += (this.cursor.x - this.outline.x) * easing;
            this.outline.y += (this.cursor.y - this.outline.y) * easing;

            this.cursorOutline.style.left = `${this.outline.x}px`;
            this.cursorOutline.style.top = `${this.outline.y}px`;

            requestAnimationFrame(() => this.animate());
        }
    }

    new StarTrail();
});

// Image Protection
document.addEventListener('contextmenu', e => {
    if (e.target.classList.contains('protected-img')) e.preventDefault();
});
document.addEventListener('keydown', e => {
    if (e.ctrlKey && (e.key === 's' || e.key === 'u') || e.key === 'F12') e.preventDefault();

});
