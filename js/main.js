/**
 * ============================================================================
 * LE NHUT KHANG VO — INTERACTIVE ENGINE
 * High-performance motion, Lenis smooth scrolling, 3D tilt, magnetic buttons,
 * dynamic case study modals, and animated stat counters.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Check Reduced Motion Preference ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // 1. LENIS SMOOTH SCROLL INITIALIZATION
  // ==========================================================================
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.75,
        infinite: false
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Connect internal anchor links to Lenis
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId !== '#') {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              e.preventDefault();
              lenis.scrollTo(targetEl, { offset: -70 });
            }
          }
        });
      });
    } catch (err) {
      console.warn('Lenis smooth scroll failed to initialize:', err);
    }
  }

  // ==========================================================================
  // 2. CUSTOM CURSOR FOLLOWER
  // ==========================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (cursorDot && cursorRing && !isTouchDevice && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    // Smooth trailing ring physics
    function updateCursorRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(updateCursorRing);
    }
    requestAnimationFrame(updateCursorRing);

    // Hover expansions
    const interactiveSelectors = 'a, button, input, textarea, .glass-card, .btn, .filter-btn, .social-pill, .tech-pill';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });
  }

  // ==========================================================================
  // 3. MAGNETIC BUTTONS
  // ==========================================================================
  if (!isTouchDevice && !prefersReducedMotion) {
    const magneticElements = document.querySelectorAll('.magnetic-target');
    magneticElements.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // ==========================================================================
  // 4. 3D TILT & CURSOR-FOLLOW SPOTLIGHT ON CARDS
  // ==========================================================================
  const tiltCards = document.querySelectorAll('.tilt-card, .glass-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables for radial specular spotlight
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (!prefersReducedMotion && !isTouchDevice && card.classList.contains('tilt-card')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = -((y - centerY) / centerY) * 4; // subtle max 4 deg
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!prefersReducedMotion && card.classList.contains('tilt-card')) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });
  });

  // ==========================================================================
  // 5. AMBIENT AURORA MOUSE PARALLAX
  // ==========================================================================
  const auroraContainer = document.querySelector('.aurora-container');
  if (auroraContainer && !isTouchDevice && !prefersReducedMotion) {
    let windowW = window.innerWidth;
    let windowH = window.innerHeight;

    window.addEventListener('resize', () => {
      windowW = window.innerWidth;
      windowH = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      const offsetX = (e.clientX / windowW - 0.5) * 35;
      const offsetY = (e.clientY / windowH - 0.5) * 35;
      auroraContainer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });
  }

  // ==========================================================================
  // 6. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-item, .bento-card, .project-card, .timeline-item, .education-card');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  revealElements.forEach((el, index) => {
    el.classList.add('reveal-item');
    el.style.transitionDelay = `${(index % 4) * 0.08}s`;
    revealObserver.observe(el);
  });

  // ==========================================================================
  // 7. ANIMATED NUMBER COUNTERS
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const targetEl = entry.target;
        const targetNum = parseInt(targetEl.getAttribute('data-target'), 10);
        if (!isNaN(targetNum)) {
          animateCount(targetEl, targetNum);
        }
        observer.unobserve(targetEl);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((numEl) => counterObserver.observe(numEl));

  function animateCount(el, target) {
    const duration = 1800; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo curve: 1 - 2^(-10 * progress)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * target);

      el.textContent = currentVal >= 1000 ? currentVal.toLocaleString() : currentVal;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target >= 1000 ? target.toLocaleString() : target;
      }
    }
    requestAnimationFrame(step);
  }

  // ==========================================================================
  // 8. NAVIGATION SCROLL & ACTIVE LINK SPY
  // ==========================================================================
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Toggle blur header on scroll
    if (scrollPos > 40) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    // Scroll spy
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }, { passive: true });

  // ==========================================================================
  // 9. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    function toggleDrawer(isOpen) {
      const state = typeof isOpen === 'boolean' ? isOpen : !mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', state);
      mobileDrawer.setAttribute('aria-hidden', !state);
      mobileMenuBtn.setAttribute('aria-expanded', state);
      document.body.style.overflow = state ? 'hidden' : '';
    }

    mobileMenuBtn.addEventListener('click', () => toggleDrawer());

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => toggleDrawer(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleDrawer(false);
      }
    });
  }

  // ==========================================================================
  // 10. SUPPORTING PROJECTS FILTERABLE GRID & SLIDING INDICATOR
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterIndicator = document.getElementById('filterIndicator');
  const projectCards = document.querySelectorAll('.supporting-projects-grid .project-card');

  function updateIndicator(btn) {
    if (!filterIndicator || !btn) return;
    const btnRect = btn.getBoundingClientRect();
    const parentRect = btn.parentElement.getBoundingClientRect();
    const leftOffset = btnRect.left - parentRect.left;

    filterIndicator.style.transform = `translateX(${leftOffset}px)`;
    filterIndicator.style.width = `${btnRect.width}px`;
  }

  // Position indicator initially on active button
  const initialActive = document.querySelector('.filter-btn.active');
  if (initialActive) {
    setTimeout(() => updateIndicator(initialActive), 100);
  }

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.filter-btn.active');
    if (currentActive) updateIndicator(currentActive);
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      updateIndicator(btn);

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category').split(' ');
        const matches = filterVal === 'all' || categories.includes(filterVal);

        if (matches) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // ==========================================================================
  // 11. CASE STUDY MODAL SYSTEM
  // ==========================================================================
  const caseStudies = {
    'trip-marketplace': {
      badge: 'FLAGSHIP PRODUCTION SHOWCASE · SOLE DEVELOPER',
      title: 'Trip Marketplace Platform',
      subtitle: 'Next.js · React Native · NestJS · Supabase · Stripe · AWS · Docker',
      overview: 'A commercial, multi-platform marketplace built solo for an Australian client where travel creators publish and monetize self-guided itineraries. The platform features automated route generation via photo geolocation, turn-by-turn waypoint navigation, multi-party Stripe payouts, and dedicated web/mobile client applications.',
      challenges: [
        'Strategic Scope Curation: Pushed back on the client’s expansive initial requirements document and successfully convinced leadership to ship a tightly validated, core product first.',
        'Photo-Sync Geolocation: Engineered an automated route generator extracting GPS EXIF data from creator photos, sorting waypoints chronologically, and computing topological route lines.',
        'Real-Time Waypoint Tracking: Developed active GPS proximity alerts in React Native for travelers following purchased routes in low-connectivity areas.',
        'Payment & Auth Infrastructure: Integrated Stripe Connect webhooks with split fees and automated creator payouts; architected Supabase PostgreSQL with strict Row Level Security (RLS) policies.',
        'Internal Moderation Portal: Built a separate internal moderation panel using React + Vite for admin inspection, dispute resolution, and commission tracking.',
        'Enterprise Reliability: Containerized NestJS API with Docker, orchestrated CI/CD through GitHub Actions, enforced strict coverage thresholds in Jest & Vitest, and deployed API on AWS EC2 with Load Balancing and web on AWS Amplify.'
      ],
      techTags: ['Next.js', 'React Native', 'NestJS', 'Supabase', 'PostgreSQL', 'Stripe', 'AWS EC2', 'AWS Amplify', 'Docker', 'GitHub Actions', 'Sentry', 'Jest', 'Vitest'],
      links: [
        { label: 'Production Status: Deployed on AWS & App Stores (Client NDA)', href: '#' }
      ]
    },
    'estuary-running': {
      badge: 'PRODUCTION BACKEND · SALESTECH ENTERPRISE',
      title: 'Virtual Running & CRM Engine',
      subtitle: '.NET 8 · C# · PostgreSQL · MongoDB · Redis · Docker',
      overview: 'Engineered high-throughput backend APIs at Estuary Solutions (Vietnam) for a high-traffic Virtual Running tracking application and enterprise loyalty CRM delivered to corporate clients across 13 countries in the Asia Pacific region.',
      challenges: [
        '2D Runner Coordinate Reconstruction: Processed telemetry feeds from running apps to reconstruct continuous user routes across a 2D coordinate plane from velocity and distance markers (.NET 8, PostgreSQL).',
        'Mathematical Fair Lucky Draw: Designed and implemented an index-based randomised selection algorithm for a multi-category promotional lucky-draw feature (.NET 8, MongoDB), mathematically preventing bias.',
        '13-Country Timezone Resolution: Identified and solved a critical production bug causing race conditions across 13 distinct timezones. Authored the technical proposal to standardize all client timestamps to server UTC, adopted org-wide.',
        'Agile Delivery: Actively contributed to daily standups, sprint estimation, and code reviews in a 12-person cross-functional squad (backend, frontend, QA, BA).'
      ],
      techTags: ['.NET 8', 'C#', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'REST API', 'Entity Framework', 'Agile / Scrum'],
      links: [
        { label: 'Company: Estuary Solutions (SalesTech APAC)', href: 'https://estuary.solutions' }
      ]
    },
    'dost-capstone': {
      badge: 'GOVERNMENT ENTERPRISE · QUT CAPSTONE',
      title: 'Budget Request Lifecycle Platform for DOST',
      subtitle: 'Department of Science and Technology, Philippines · React (Vite) · Laravel · PHPUnit',
      overview: 'Official QUT Capstone project for the Department of Science and Technology (DOST, Philippines). Serving as Technical Solution Designer and Developer in a 5-person international team to streamline and automate multi-department government budget request and approval lifecycles.',
      challenges: [
        'Phase 1 Architecture: Conducted extensive stakeholder interviews with international government officers, producing comprehensive system design specifications, UML workflows, and security threat models.',
        'Phase 2 Implementation: Developing a responsive client portal in React (Vite) + Bootstrap paired with a hardened Laravel RESTful API backend.',
        'Automated CI Test Suite: Configured PHPUnit with Mockery and in-memory SQLite testing, wired into GitHub Actions to automatically generate and publish JUnit compliance reports.'
      ],
      techTags: ['React (Vite)', 'Bootstrap', 'Laravel', 'PHP', 'PHPUnit', 'Mockery', 'SQLite', 'GitHub Actions CI', 'System Design'],
      links: [
        { label: 'QUT Capstone Project (Phase 2 In Progress)', href: 'https://github.com/khangdev20' }
      ]
    },
    'donation-tracker': {
      badge: 'FULLSTACK CLOUD APPLICATION',
      title: 'Donation Tracker & Ledger System',
      subtitle: 'React · Express.js · AWS EC2 · GitHub Actions CI/CD',
      overview: 'A full-stack financial ledger web application engineered for non-profit transparency, enabling real-time campaign budgeting, donor allocation tracing, and audit-ready financial reporting.',
      challenges: [
        'Fullstack Development: Built modern React client application with stateful financial charts and a Node.js / Express.js REST API with input sanitation.',
        'Cloud CI/CD Pipeline: Automated continuous integration and deployment with GitHub Actions, pushing verified builds directly to an AWS EC2 cloud instance.',
        'Data Consistency: Implemented ACID-compliant transactional updates for ledger disbursements to avoid double-allocation errors.'
      ],
      techTags: ['React', 'JavaScript', 'Node.js', 'Express.js', 'AWS EC2', 'GitHub Actions', 'CI/CD'],
      links: [
        { label: 'GitHub Repository', href: 'https://github.com/khangdev20' }
      ]
    },
    'grocery-store': {
      badge: 'ENTERPRISE DATABASE DESIGN · ACADEMIC',
      title: 'Grocery Store Management System',
      subtitle: 'Python (Flask) · MySQL · Jinja2 · Relational Modeling',
      overview: 'Academic database-design project modeling complex retail operations including multi-category stock inventory, supply chain tracking, customer orders, and staff point-of-sale transactions.',
      challenges: [
        '3NF Relational Modeling: Designed normalized database schemas enforcing referential integrity, composite keys, custom triggers, and performance-tuned indexes.',
        'Transactional Integrity: Handled concurrent stock deductions with database transactions to prevent inventory race conditions.',
        'Web Interface: Built a full-featured management dashboard with Python (Flask), MySQL connector, and Jinja2 templating.'
      ],
      techTags: ['Python', 'Flask', 'MySQL', 'Jinja2', 'Database Normalization', 'SQL Optimization'],
      links: [
        { label: 'GitHub Repository', href: 'https://github.com/khangdev20' }
      ]
    }
  };

  const caseStudyModal = document.getElementById('caseStudyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBodyContent');

  window.openCaseStudy = function (projectId) {
    const data = caseStudies[projectId];
    if (!data || !caseStudyModal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-meta-header">
        <span class="modal-badge">${data.badge}</span>
        <h3 class="modal-title" id="modalTitle">${data.title}</h3>
        <div class="modal-subtitle">${data.subtitle}</div>
      </div>

      <div class="modal-content-section">
        <h4 class="modal-section-title">
          <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Architectural Overview
        </h4>
        <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.65;">${data.overview}</p>
      </div>

      <div class="modal-content-section">
        <h4 class="modal-section-title">
          <svg class="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Key Technical Decisions & Engineering Achievements
        </h4>
        <ul class="modal-bullet-list">
          ${data.challenges.map((c) => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-content-section">
        <h4 class="modal-section-title">Verified Tech Stack</h4>
        <div class="modal-tech-stack">
          ${data.techTags.map((tag) => `<span class="tech-pill highlight">${tag}</span>`).join('')}
        </div>
      </div>

      <div class="modal-content-section" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.25rem;">
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          ${data.links.map((link) => `
            <a href="${link.href}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
              <span>${link.label}</span>
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>
            </a>
          `).join('')}
        </div>
      </div>
    `;

    caseStudyModal.classList.add('open');
    caseStudyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    if (!caseStudyModal) return;
    caseStudyModal.classList.remove('open');
    caseStudyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (caseStudyModal) {
    caseStudyModal.addEventListener('click', (e) => {
      if (e.target === caseStudyModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseStudyModal && caseStudyModal.classList.contains('open')) {
      closeModal();
    }
  });

  // ==========================================================================
  // 12. CLIPBOARD COPY TOAST NOTIFICATION
  // ==========================================================================
  const copyToast = document.getElementById('copyToast');
  const toastMsg = document.getElementById('toastMsg');
  const copyEmailQuickBtn = document.getElementById('copyEmailQuickBtn');
  let toastTimer = null;

  function showToast(message) {
    if (!copyToast) return;
    if (toastMsg) toastMsg.textContent = message;
    copyToast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      copyToast.classList.remove('show');
    }, 3200);
  }

  if (copyEmailQuickBtn) {
    copyEmailQuickBtn.addEventListener('click', () => {
      const email = copyEmailQuickBtn.getAttribute('data-email') || 'lenhutkhangvo@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        showToast('Direct email: lenhutkhangvo@gmail.com');
      });
    });
  }

  // ==========================================================================
  // 13. ZERO-BACKEND STATIC CONTACT FORM (MAILTO DISPATCH)
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.style.color = '#f87171';
          formStatus.textContent = 'Please complete all required fields.';
        }
        return;
      }

      // Build mailto URI
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject || 'Connecting with Khang Vo'}`);
      const mailtoBody = encodeURIComponent(
        `Hi Khang,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`
      );

      const mailtoLink = `mailto:lenhutkhangvo@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      if (formStatus) {
        formStatus.style.color = '#34d399';
        formStatus.textContent = 'Opening your email client...';
      }

      // Open mailto link
      window.location.href = mailtoLink;

      showToast('Opening default email client with your message drafted!');

      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = 'Message drafted! You can also email directly at lenhutkhangvo@gmail.com';
        }
      }, 2000);
    });
  }

  // ==========================================================================
  // 14. FEATURED MOCKUP SUBTLE SCROLL PARALLAX
  // ==========================================================================
  const mockupParallax = document.getElementById('mockupParallaxLayer');
  if (mockupParallax && !isTouchDevice && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const rect = mockupParallax.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const scrollDelta = (window.innerHeight / 2 - rect.top) * 0.05;
        mockupParallax.style.transform = `translate3d(0, ${-scrollDelta}px, 0)`;
      }
    }, { passive: true });
  }

});
