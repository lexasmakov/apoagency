document.addEventListener('DOMContentLoaded', () => {

    // 0. Page loader
    const loader = document.getElementById('page-loader');
    const fill = document.querySelector('.loader-bar-fill');
    let progress = 0;

    const loaderInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        fill.style.width = progress + '%';
    }, 150);

    window.addEventListener('load', () => {
        clearInterval(loaderInterval);
        fill.style.width = '100%';
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 400);
    });

    // 1. Cursor Follower (Lerp)
    const cursor = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const lerpFactor = 0.15;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * lerpFactor;
        cursorY += (mouseY - cursorY) * lerpFactor;
        
        cursor.style.transform = `translate(${cursorX - 14}px, ${cursorY - 14}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect for cursor
    const interactiveElements = document.querySelectorAll('a, button, .email-address');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = mobileNav.querySelectorAll('a');

    mobileToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        // Simple hamburger animation
        const spans = mobileToggle.querySelectorAll('span');
        mobileNav.classList.contains('active') ? 
            (spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)',
             spans[1].style.opacity = '0',
             spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)') :
            (spans[0].style.transform = 'none',
             spans[1].style.opacity = '1',
             spans[2].style.transform = 'none');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // 4. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('service-card')) {
                    entry.target.classList.add('lit');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .service-card').forEach(el => observer.observe(el));

    // 5. Copy Email to Clipboard
    const emailEl = document.getElementById('email-copy');
    const toast = document.getElementById('toast');

    emailEl.addEventListener('click', () => {
        const emailText = emailEl.textContent;
        navigator.clipboard.writeText(emailText).then(() => {
            toast.classList.add('visible');
            setTimeout(() => {
                toast.classList.remove('visible');
            }, 2000);
        });
    });

    // 6. Cycling Hero Headline
    const words = ['digitální', 'moderní', 'kreativní', 'výjimečný'];
    let current = 0;
    const cyclingEl = document.querySelector('.cycling-text');

    if (cyclingEl) {
        function cycleWord() {
            // exit animation
            cyclingEl.style.opacity = '0';
            cyclingEl.style.transform = 'translateY(-30px)';
            
            setTimeout(() => {
                current = (current + 1) % words.length;
                cyclingEl.textContent = words[current];
                cyclingEl.style.transition = 'none';
                cyclingEl.style.transform = 'translateY(30px)';
                cyclingEl.style.opacity = '0';
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        cyclingEl.style.transition = 'all 0.4s ease';
                        cyclingEl.style.opacity = '1';
                        cyclingEl.style.transform = 'translateY(0)';
                    });
                });
            }, 400);
        }

        // Initialize
        cyclingEl.textContent = words[0];
        cyclingEl.style.opacity = '1';
        cyclingEl.style.transform = 'translateY(0)';
        cyclingEl.style.transition = 'all 0.4s ease';
        setInterval(cycleWord, 2500);
    }

    // 7. Portfolio Image Loading Detection
    document.querySelectorAll('.portfolio-img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });

    // 8. Blob Visibility Observer
    const pageBg = document.querySelector('.page-bg');
    if (pageBg) {
        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                document.querySelectorAll('.blob').forEach(blob => {
                    blob.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                });
            });
        }, { threshold: 0 });
        bgObserver.observe(pageBg);
    }
});
