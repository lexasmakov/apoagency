document.addEventListener('DOMContentLoaded', () => {
  // Grain Canvas
  const createGrainCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'grain-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1000';
    canvas.style.opacity = '0.035';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let w, h;
    
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    
    const render = () => {
      const idata = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;
      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.5) buffer32[i] = 0xff000000;
        else buffer32[i] = 0xffffffff;
      }
      ctx.putImageData(idata, 0, 0);
      requestAnimationFrame(render);
    };
    
    window.addEventListener('resize', resize);
    resize();
    render();
  };
  createGrainCanvas();

  // Custom Cursor
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  
  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (cursorRing) {
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    const hoverElements = document.querySelectorAll('a, button');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursorRing) cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        if (cursorRing) cursorRing.classList.remove('hover');
      });
    });
  }

  // Magnetic Buttons
  const magneticItems = document.querySelectorAll('.btn-magnetic');
  magneticItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const h = rect.width / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(item, {
        x: x * 0.2, // ~8px max
        y: y * 0.2,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(item, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
  });

  // Sticky Nav & Scroll Progress
  const nav = document.querySelector('.nav');
  const scrollProgress = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', () => {
    if (nav) {
      if (window.scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = scrolled + '%';
    }
  });

  // Mobile Menu
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Active Nav Link highlight
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else if (link.getAttribute('href').startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => {
    if (section.id) navObserver.observe(section);
  });

  // GSAP Animations Setup
  gsap.registerPlugin(ScrollTrigger);

  // Preloader Sequence
  if (document.querySelector('.preloader')) {
    const tl = gsap.timeline();
    tl.to('.preloader__letter', {
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power4.out"
    })
    .to('.preloader', {
      autoAlpha: 0,
      duration: 0.6,
      ease: "power4.inOut",
      delay: 0.4
    })
    .from('.hero__eyebrow', { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.2")
    .from('.hero__title-line', { y: 100, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power4.out" }, "-=0.4")
    .from('.hero__sub', { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.6")
    .from('.hero .btn', { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.5");
  }

  // Scroll Reveal: IntersectionObserver for .fade-up
  const revealElements = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // GSAP ScrollTrigger overrides/additions
  
  // Section headings fade up
  gsap.utils.toArray('.section__heading').forEach(heading => {
    // Prevent conflict if it uses .fade-up
    if (!heading.classList.contains('fade-up')) {
      gsap.from(heading, {
        scrollTrigger: { trigger: heading, start: 'top 85%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
    }
  });

  // We remove .fade-up transition from GSAP staggered items to avoid conflicts
  document.querySelectorAll('.service-card, .ref-card').forEach(el => {
    el.style.transition = 'none';
    el.classList.remove('fade-up');
  });

  // Service cards stagger
  const servicesGrid = document.querySelector('.services__grid');
  if (servicesGrid) {
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: servicesGrid,
        start: 'top 80%'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  // Ref cards stagger and scale
  const referenceGrid = document.querySelector('.reference__grid');
  if (referenceGrid) {
    gsap.from('.ref-card', {
      scrollTrigger: {
        trigger: referenceGrid,
        start: 'top 80%'
      },
      y: 40,
      scale: 0.95,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  // Contact heading: letter spans stagger
  const contactHeadingInnerSpans = document.querySelectorAll('.contact__heading span');
  if (contactHeadingInnerSpans.length === 0) {
    const contactHeading = document.querySelector('.contact__heading');
    if (contactHeading) {
      const text = contactHeading.textContent;
      contactHeading.innerHTML = '';
      [...text].forEach(char => {
        if (char === ' ') {
          contactHeading.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          contactHeading.appendChild(span);
        }
      });
      
      gsap.to('.contact__heading span', {
        scrollTrigger: {
          trigger: '.contact__heading',
          start: 'top 85%',
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out"
      });
    }
  }

  // Reference 3D Tilt
  const refCards = document.querySelectorAll('.ref-card');
  if (window.matchMedia('(hover: hover)').matches) {
    refCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15; 
        const rotateY = ((x - centerX) / centerX) * 15;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: "power2.out"
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
      });
    });
  }

  // Clipboard copy Toast
  const emailLink = document.getElementById('copy-email');
  const toast = document.getElementById('toast');
  if (emailLink && toast) {
    emailLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText('ahoj@apo.cz').then(() => {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2000);
        });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = 'ahoj@apo.cz';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2000);
        } catch (err) {}
        document.body.removeChild(textArea);
      }
    });
  }

  // Contact Form Setup
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('.form__input, .form__textarea');
      inputs.forEach(input => {
        if (!input.checkValidity() || !input.value.trim()) {
          isValid = false;
          input.style.borderBottomColor = 'red';
        } else {
          input.style.borderBottomColor = '';
        }
      });

      if (isValid) {
        if (formSuccess) formSuccess.style.display = 'block';
        form.reset();
        setTimeout(() => {
          if (formSuccess) formSuccess.style.display = 'none';
        }, 5000);
      }
    });
  }
});
