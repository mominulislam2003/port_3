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

    // --- Form Handling & Rocket Animation ---
    const form = document.getElementById("my-form");
    const status = document.getElementById("status");
    const rocket = document.getElementById("rocket-container");
    const submitBtn = document.getElementById("submit-btn");

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            submitBtn.innerText = "Ignition...";
            status.innerHTML = "Sending...";
            status.style.color = "var(--accent)";

            fetch(event.target.action, {
                method: 'POST',
                body: new FormData(event.target),
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    rocket.classList.add("launching");
                    submitBtn.innerText = "Sent into Orbit!";

                    setTimeout(() => {
                        status.innerHTML = "Message reached the stars! (Success)";
                        status.style.color = "var(--accent)";
                        rocket.classList.remove("launching");
                        submitBtn.innerText = "Send Message";
                        form.reset();
                    }, 2000);
                } else {
                    status.innerHTML = "Oops! Submission failed.";
                    status.style.color = "red";
                    submitBtn.innerText = "Try Again";
                }
            }).catch(error => {
                status.innerHTML = "Oops! Connection issue.";
                status.style.color = "red";
                submitBtn.innerText = "Try Again";
            });
        });
    }

    // --- Mouse Tracking & Cursor Tracer ---
    const tracer = document.getElementById('cursor-tracer');
    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.01;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.01;

        if (tracer) {
            tracer.style.left = e.clientX + 'px';
            tracer.style.top = e.clientY + 'px';
        }

        createParticle(e.clientX, e.clientY);
    });

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        const size = Math.random() * 4 + 'px';
        particle.style.width = size;
        particle.style.height = size;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }

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
            constructor() { this.reset(); }
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
                ctx.arc(this.x + mouseX * this.z, this.y + mouseY * this.z, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initStars() {
            stars = [];
            const density = window.innerWidth < 768 ? 8000 : 4000;
            const starCount = Math.floor((width * height) / density);
            for (let i = 0; i < starCount; i++) stars.push(new Star());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#050a18');
            gradient.addColorStop(1, '#000000');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            stars.forEach(star => { star.update(); star.draw(); });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // --- Scroll Observer ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const bars = entry.target.querySelectorAll('.fill');
                bars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    if (targetWidth) bar.style.width = targetWidth;
                });
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.timeline-item, .skill-category, .tool-card, .info-card, .lang-card').forEach(el => {
        el.classList.add('hidden-scroll');
        observer.observe(el);
    });

    document.querySelectorAll('.fill').forEach(bar => {
        bar.setAttribute('data-width', bar.style.width);
        bar.style.width = '0%';
    });

    // --- Hero Parallax & Apple-style Reveal ---
    const homeContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    const handleScroll = () => {
        const scrolled = window.scrollY;
        const viewportHeight = window.innerHeight;

        if (scrolled <= viewportHeight) {
            // Hero Parallax, Fade and Scale Down
            if (homeContent) {
                const progress = scrolled / (viewportHeight * 0.8);
                const opacity = Math.max(0, 1 - progress);
                const scale = 1 - (progress * 0.05); // Slight scale down
                const translateY = scrolled * 0.3; // Slower parallax

                homeContent.style.opacity = opacity;
                homeContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
            }

            // Scroll Indicator Fade
            if (scrollIndicator) {
                scrollIndicator.style.opacity = Math.max(0, 1 - (scrolled / 200));
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to set state
    handleScroll();
});
