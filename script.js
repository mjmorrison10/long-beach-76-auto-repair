// ============================================
// Long Beach 76 Auto Repair - Interactive Scripts
// Enhanced with animations, counters, and UX features
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // MOBILE MENU - Smooth height transition
    // ========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // ========================================
    // NAVBAR - Scroll shadow effect
    // ========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ========================================
    // SMOOTH SCROLL - For anchor links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ========================================
    // SCROLL PROGRESS BAR
    // ========================================
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    const backToTop = document.getElementById('backToTop');
    function toggleBackToTop() {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========================================
    // ANIMATED COUNTER - Stats numbers
    // ========================================
    function animateCounter(element, target, duration, isDecimal, suffix) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (target - start) * eased;

            if (isDecimal) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.round(current) + (suffix || '');
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.classList.add('counted');
            }
        }
        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const count = parseFloat(el.dataset.count);
                const isDecimal = el.dataset.decimal === 'true';
                const suffix = el.dataset.suffix || '';
                const originalText = el.textContent;

                if (!isNaN(count)) {
                    animateCounter(el, count, 2000, isDecimal, suffix);
                }
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
        statsObserver.observe(el);
    });

    // ========================================
    // STAGGERED ANIMATIONS - Service cards, reviews, etc.
    // ========================================
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = Array.from(parent.querySelectorAll('[data-animate="stagger"]'));
                const index = siblings.indexOf(entry.target);
                const delay = index * 100;

                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                }, delay);

                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate="stagger"]').forEach(el => {
        staggerObserver.observe(el);
    });

    // Also handle elements without data-animate that need observation
    const genericObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.opacity = '1';
                genericObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.service-card:not([data-animate]), .review-card:not([data-animate])').forEach(el => {
        el.style.opacity = '0';
        genericObserver.observe(el);
    });

    // ========================================
    // PARALLAX HERO - Subtle parallax on hero content
    // ========================================
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            if (scrollY < heroHeight) {
                const offset = scrollY * 0.3;
                heroContent.style.transform = `translateY(${offset}px)`;
            }
        }, { passive: true });
    }

    // ========================================
    // HERO PARTICLES - Floating dots
    // ========================================
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '-10px';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            heroParticles.appendChild(particle);
        }
    }

    // ========================================
    // SMOG PRICE SHIMMER - Periodic emphasis
    // ========================================
    const smogPriceCard = document.getElementById('smogPriceCard');
    if (smogPriceCard) {
        // Add an extra emphasis pulse every 5 seconds
        setInterval(() => {
            smogPriceCard.style.transform = 'scale(1.03)';
            smogPriceCard.style.transition = 'transform 0.4s ease';
            setTimeout(() => {
                smogPriceCard.style.transform = 'scale(1)';
            }, 400);
        }, 5000);
    }

    // ========================================
    // CTA PULSE - Auto-add pulse to hero CTA after 3 seconds
    // ========================================
    setTimeout(() => {
        document.querySelectorAll('.hero-ctas .btn-primary').forEach(btn => {
            if (!btn.classList.contains('btn-pulse')) {
                btn.classList.add('btn-pulse');
            }
        });
    }, 3000);

    // ========================================
    // ACTIVE NAV HIGHLIGHTING - Based on scroll position
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a[data-section]');

    function highlightNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

    // ========================================
    // OPEN/CLOSED INDICATOR
    // ========================================
    function updateOpenStatus() {
        const statusEl = document.getElementById('openStatus');
        if (!statusEl) return;
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        let isOpen = false;
        if (day >= 1 && day <= 5 && hour >= 8 && hour < 17) isOpen = true;
        if (day === 6 && hour >= 8 && hour < 14) isOpen = true;
        if (isOpen) {
            statusEl.innerHTML = '<span style="color: #10b981; font-weight: 700;">OPEN NOW</span> Mon-Fri: 8AM-5PM | Sat: 8AM-2PM';
        } else {
            statusEl.innerHTML = '<span style="color: #ef4444; font-weight: 700;">CLOSED</span> Mon-Fri: 8AM-5PM | Sat: 8AM-2PM';
        }
        const mobileHours = document.getElementById('mobileHours');
        if (mobileHours) {
            if (isOpen) {
                mobileHours.innerHTML = '<span style="color: #10b981; font-weight: 700;">OPEN</span> until ' + (day === 6 ? '2PM' : '5PM');
            } else {
                mobileHours.textContent = 'Opens Mon 8AM';
            }
        }
    }
    updateOpenStatus();
    setInterval(updateOpenStatus, 60000);

    // ========================================
    // FORM VALIDATION - Real-time with visual feedback
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');

    function validateName() {
        const val = nameInput.value.trim();
        if (val.length === 0) {
            nameInput.classList.remove('valid', 'invalid');
            nameError.textContent = '';
            return false;
        }
        if (val.length < 2) {
            nameInput.classList.add('invalid');
            nameInput.classList.remove('valid');
            nameError.textContent = 'Name must be at least 2 characters';
            return false;
        }
        nameInput.classList.add('valid');
        nameInput.classList.remove('invalid');
        nameError.textContent = '';
        return true;
    }

    function validatePhone() {
        const val = phoneInput.value.trim();
        if (val.length === 0) {
            phoneInput.classList.remove('valid', 'invalid');
            phoneError.textContent = '';
            return false;
        }
        const phoneRegex = /[\d\s\-\(\)\+]{7,}/;
        if (!phoneRegex.test(val)) {
            phoneInput.classList.add('invalid');
            phoneInput.classList.remove('valid');
            phoneError.textContent = 'Please enter a valid phone number';
            return false;
        }
        phoneInput.classList.add('valid');
        phoneInput.classList.remove('invalid');
        phoneError.textContent = '';
        return true;
    }

    function validateEmail() {
        const val = emailInput.value.trim();
        if (val.length === 0) {
            emailInput.classList.remove('valid', 'invalid');
            emailError.textContent = '';
            return true; // Email is optional
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
            emailInput.classList.add('invalid');
            emailInput.classList.remove('valid');
            emailError.textContent = 'Please enter a valid email address';
            return false;
        }
        emailInput.classList.add('valid');
        emailInput.classList.remove('invalid');
        emailError.textContent = '';
        return true;
    }

    nameInput.addEventListener('input', validateName);
    nameInput.addEventListener('blur', validateName);
    phoneInput.addEventListener('input', validatePhone);
    phoneInput.addEventListener('blur', validatePhone);
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();

        if (!isNameValid || !isPhoneValid || !isEmailValid) {
            // Trigger validation on empty required fields
            if (nameInput.value.trim().length === 0) {
                nameInput.classList.add('invalid');
                nameError.textContent = 'Name is required';
            }
            if (phoneInput.value.trim().length === 0) {
                phoneInput.classList.add('invalid');
                phoneError.textContent = 'Phone number is required';
            }
            return;
        }

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        const subject = encodeURIComponent(`Appointment Request - ${data.make || 'Vehicle'} ${data.year || ''}`);
        const body = encodeURIComponent(
            `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || 'N/A'}\n` +
            `Vehicle: ${data.make || 'N/A'} ${data.year || ''}\nService: ${data.service || 'N/A'}\n` +
            `Issue: ${data.message || 'N/A'}\n\nPlease call me to schedule an appointment.`
        );
        window.location.href = `mailto:info@lb76autorepair.com?subject=${subject}&body=${body}`;
        // Fallback if email client doesn't open
        setTimeout(() => {
            if (!document.hidden) {
                const formNote = document.querySelector('.form-note');
                if (formNote) {
                    const originalNote = formNote.textContent;
                    formNote.innerHTML = 'Email didn\'t open? Call us directly at <a href="tel:5624970460" style="color: var(--primary); font-weight: 700;">(562) 497-0460</a>';
                    setTimeout(() => {
                        formNote.textContent = originalNote;
                    }, 8000);
                }
            }
        }, 2000);
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '&#10003; Request Sent!';
        btn.style.background = '#10b981';
        btn.style.borderColor = '#10b981';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            this.reset();
            // Clear validation states
            nameInput.classList.remove('valid', 'invalid');
            phoneInput.classList.remove('valid', 'invalid');
            emailInput.classList.remove('valid', 'invalid');
            nameError.textContent = '';
            phoneError.textContent = '';
            emailError.textContent = '';
        }, 3000);
    });

    // ========================================
    // CLICK-TO-CALL TRACKING WITH LOCATION
    // ========================================
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            let location = 'unknown';
            if (link.closest('.hero')) location = 'hero';
            else if (link.closest('.urgency-banner')) location = 'urgency-banner';
            else if (link.closest('.smog-cta')) location = 'smog-cta';
            else if (link.closest('.cta-section')) location = 'cta-section';
            else if (link.closest('.mobile-cta')) location = 'mobile-cta';
            else if (link.closest('.contact')) location = 'contact-section';
            else if (link.closest('.footer')) location = 'footer';

            if (typeof gtag === 'function') {
                gtag('event', 'click_to_call', { business: 'Long Beach 76 Auto Repair', click_location: location });
            }
        });
    });

});
