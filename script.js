/* ============================================
   LONG BEACH 76 AUTO REPAIR — "THE QUICK STOP"
   Interactive Script
   ============================================ */

(function() {
  'use strict';

  // --- DOM Ready ---
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initScrollProgress();
    initHeaderScroll();
    initMobileMenu();
    initOpenClosedIndicator();
    initScrollAnimations();
    initBackToTop();
    initFormValidation();
    initClickToCallTracking();
    setCurrentYear();
  }

  // =============================================
  // Scroll Progress Bar
  // =============================================
  function initScrollProgress() {
    var progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    function updateProgress() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(progress, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // =============================================
  // Header Scroll Shadow
  // =============================================
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    function updateHeader() {
      if (window.pageYOffset > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // =============================================
  // Mobile Hamburger Menu
  // =============================================
  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function() {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    var navLinks = nav.querySelectorAll('.nav-links a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // =============================================
  // Open/Closed Indicator (updates every 60s)
  // =============================================
  function initOpenClosedIndicator() {
    var badge = document.getElementById('open-indicator');
    if (!badge) return;

    function updateStatus() {
      var now = new Date();
      var day = now.getDay(); // 0=Sun, 1=Mon...6=Sat
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var time = hours + minutes / 60;

      var isOpen = false;

      if (day >= 1 && day <= 5) {
        // Mon-Fri: 8AM-5PM
        isOpen = time >= 8 && time < 17;
      } else if (day === 6) {
        // Saturday: 8AM-2PM
        isOpen = time >= 8 && time < 14;
      }
      // Sunday: closed

      var dot = badge.querySelector('.status-dot');
      var text = badge.querySelector('.status-text');

      if (isOpen) {
        badge.className = 'status-badge open';
        if (text) text.textContent = 'Open Now';
      } else {
        badge.className = 'status-badge closed';
        if (text) text.textContent = 'Closed';
      }
    }

    updateStatus();
    setInterval(updateStatus, 60000); // Update every 60 seconds
  }

  // =============================================
  // Scroll Animations (IntersectionObserver)
  // =============================================
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    // Check for reduced motion preference
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      elements.forEach(function(el) {
        el.classList.add('animated');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // =============================================
  // Back to Top Button
  // =============================================
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    function toggleVisibility() {
      if (window.pageYOffset > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =============================================
  // Form Validation & Submission
  // =============================================
  function initFormValidation() {
    var form = document.getElementById('appointment-form');
    if (!form) return;

    // Inline validation on blur
    var requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(function(field) {
      field.addEventListener('blur', function() {
        validateField(field);
      });

      field.addEventListener('input', function() {
        // Clear error on input
        if (field.classList.contains('error')) {
          validateField(field);
        }
      });
    });

    // Email validation on blur
    var emailField = document.getElementById('email');
    if (emailField) {
      emailField.addEventListener('blur', function() {
        if (emailField.value && !isValidEmail(emailField.value)) {
          showFieldError(emailField, 'Please enter a valid email address');
        } else {
          clearFieldError(emailField);
        }
      });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var isValid = true;

      // Validate required fields
      requiredFields.forEach(function(field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      // Validate email if filled
      if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
      }

      if (!isValid) return;

      // Collect form data
      var data = {
        fullName: form.fullName.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        vehicleMake: form.vehicleMake.value.trim(),
        year: form.year.value.trim(),
        serviceNeeded: form.serviceNeeded.value,
        issue: form.issue.value.trim()
      };

      // Build email body
      var subject = 'Appointment Request - ' + data.fullName;
      var body = 'New appointment request from lb76autorepair.com:\n\n' +
        'Name: ' + data.fullName + '\n' +
        'Phone: ' + data.phone + '\n' +
        'Email: ' + (data.email || 'Not provided') + '\n' +
        'Vehicle: ' + (data.vehicleMake || 'Not specified') + ' ' + (data.year || '') + '\n' +
        'Service: ' + (data.serviceNeeded || 'Not specified') + '\n' +
        'Issue: ' + (data.issue || 'Not described') + '\n\n' +
        'Please call them within 1 hour during business hours.';

      var mailtoUrl = 'mailto:[EMAIL ADDRESS]?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      // Open mailto
      window.location.href = mailtoUrl;

      // Fallback: after 2 seconds, show phone number option
      setTimeout(function() {
        var callBtn = document.createElement('div');
        callBtn.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:32px 40px;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.2);z-index:10000;text-align:center;max-width:90vw;';

        callBtn.innerHTML = '<h3 style="font-family:var(--font-heading);font-size:20px;font-weight:700;margin-bottom:12px;color:#212529;">Prefer to call instead?</h3>' +
          '<p style="font-size:15px;color:#868e96;margin-bottom:20px;">You can reach us directly at:</p>' +
          '<a href="tel:5551234567" style="display:inline-flex;align-items:center;gap:8px;background:#0d6efd;color:#fff;padding:14px 28px;border-radius:8px;font-weight:600;font-size:16px;text-decoration:none;">(555) 123-4567</a>' +
          '<button onclick="this.parentElement.remove()" style="display:block;margin:16px auto 0;background:none;border:none;color:#868e96;font-size:14px;cursor:pointer;">Close</button>';

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:9999;';
        overlay.onclick = function() {
          overlay.remove();
          callBtn.remove();
        };

        document.body.appendChild(overlay);
        document.body.appendChild(callBtn);
      }, 2000);

      // Show success state on button
      var submitBtn = document.getElementById('form-submit-btn');
      if (submitBtn) {
        submitBtn.textContent = 'Request Sent!';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        setTimeout(function() {
          submitBtn.textContent = "Schedule My Appointment (We'll Call You Within 1 Hour)";
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }, 5000);
      }
    });
  }

  function validateField(field) {
    var value = field.value.trim();
    var fieldName = field.id;
    var errorEl = document.getElementById(fieldName + '-error');

    if (field.hasAttribute('required') && !value) {
      var labels = {
        'fullName': 'Please enter your full name',
        'phone': 'Please enter your phone number'
      };
      var msg = labels[fieldName] || 'This field is required';
      showFieldError(field, msg);
      return false;
    }

    if (fieldName === 'phone' && value) {
      var phoneClean = value.replace(/[\s\-\(\)\.]/g, '');
      if (phoneClean.length < 10) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
      }
    }

    clearFieldError(field);
    return true;
  }

  function showFieldError(field, message) {
    field.classList.add('error');
    var errorEl = document.getElementById(field.id + '-error');
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearFieldError(field) {
    field.classList.remove('error');
    var errorEl = document.getElementById(field.id + '-error');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // =============================================
  // Click-to-Call Tracking (gtag)
  // =============================================
  function initClickToCallTracking() {
    var callLinks = document.querySelectorAll('[data-gtag]');
    callLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        var eventType = link.getAttribute('data-gtag');
        if (typeof gtag === 'function') {
          gtag('event', 'click_to_call', {
            event_category: 'engagement',
            event_label: eventType,
            value: 1
          });
        }
        // Fallback: console log for development
        if (window.console && console.log) {
          console.log('[gtag] click_to_call:', eventType);
        }
      });
    });
  }

  // =============================================
  // Set Current Year in Footer
  // =============================================
  function setCurrentYear() {
    var yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

})();
