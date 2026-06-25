/**
 * ═══════════════════════════════════════════════════════════════
 * MOHAMED OSAMA · PORTFOLIO
 * main.js — All JavaScript: canvas animations + UI interactions
 * ═══════════════════════════════════════════════════════════════
 *
 * TABLE OF CONTENTS
 * ─────────────────
 *  1.  PCB Circuit Canvas  (Signature element — animated traces)
 *  2.  Particle Field Canvas
 *  3.  Typewriter Effect   (hero eyebrow)
 *  4.  Counter Animation   (about stat cards)
 *  5.  Scroll Reveal       (IntersectionObserver)
 *  6.  Skill Bar Fill      (IntersectionObserver)
 *  7.  Active Nav Link     (IntersectionObserver)
 *  8.  Nav Scroll Compression
 *  9.  Mobile Nav (hamburger + overlay)
 *  10. Smooth Anchor Scrolling
 *  11. Cursor Glow Follower (desktop only)
 *  12. Card Tilt on Mouse  (project cards)
 *  13. Scroll Progress Bar
 *  14. Init
 * ═══════════════════════════════════════════════════════════════
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. PCB CIRCUIT CANVAS
   Draws right-angle copper traces + glowing nodes, mimicking a
   real printed circuit board. This is the site's signature
   visual — unique to mechatronics / embedded engineering.
   Runs on a fixed full-screen canvas behind all content.
───────────────────────────────────────────────────────────── */
function initPCBCanvas() {
  const canvas = document.getElementById('pcb-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* Resize handler */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    buildTraces();
  });

  let traces = [];

  /**
   * Build a fresh set of PCB-style traces.
   * Each trace is a polyline of right-angle segments starting from
   * a random point and turning 90° probabilistically at each step.
   */
  function buildTraces() {
    traces = [];
    const COUNT = Math.max(20, Math.min(40, Math.floor(window.innerWidth / 45)));

    for (let i = 0; i < COUNT; i++) {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      const segments = [];

      let cx  = startX;
      let cy  = startY;
      let dir = Math.floor(Math.random() * 4); // 0=R, 1=D, 2=L, 3=U
      const segCount = 4 + Math.floor(Math.random() * 7);

      for (let s = 0; s < segCount; s++) {
        const dist = 35 + Math.random() * 90;
        let nx = cx, ny = cy;

        if      (dir === 0) nx += dist;
        else if (dir === 1) ny += dist;
        else if (dir === 2) nx -= dist;
        else                ny -= dist;

        segments.push({ x1: cx, y1: cy, x2: nx, y2: ny });
        cx = nx;
        cy = ny;

        /* 70 % chance of a 90° turn at each elbow */
        if (Math.random() < 0.7) {
          dir = (dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
        }
      }

      traces.push({
        segments,
        /* Highlight nodes at start and end of the trace */
        nodes: [
          { x: startX, y: startY },
          { x: cx,     y: cy     },
        ],
        phase: Math.random() * Math.PI * 2,
        speed: 0.007 + Math.random() * 0.007,
      });
    }
  }

  buildTraces();

  /**
   * Main animation loop.
   * @param {number} ts — timestamp from requestAnimationFrame
   */
  function draw(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = ts * 0.001;

    traces.forEach(tr => {
      const alpha = 0.3 + 0.25 * Math.sin(t * tr.speed * 6 + tr.phase);

      /* ── Draw trace segments ── */
      ctx.strokeStyle = `rgba(0,207,255,${alpha})`;
      ctx.lineWidth   = 1;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      tr.segments.forEach(seg => {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      });
      ctx.stroke();

      /* ── Draw glowing nodes ── */
      tr.nodes.forEach(nd => {
        const r  = 2.5 + 1.5 * Math.sin(t * tr.speed * 8 + tr.phase);
        const ga = 0.45 + 0.55 * Math.sin(t * tr.speed * 5 + tr.phase);

        /* Outer halo ring */
        ctx.strokeStyle = `rgba(0,207,255,${ga * 0.35})`;
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, r + 5, 0, Math.PI * 2);
        ctx.stroke();

        /* Filled node dot */
        ctx.fillStyle = `rgba(0,207,255,${ga * 0.9})`;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}


/* ─────────────────────────────────────────────────────────────
   2. PARTICLE FIELD CANVAS
   Small drifting particles with connecting lines when close.
   Complements the PCB traces with an organic layer.
───────────────────────────────────────────────────────────── */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Particle class */
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x   = Math.random() * canvas.width;
      this.y   = Math.random() * canvas.height;
      this.vx  = (Math.random() - 0.5) * 0.35;
      this.vy  = (Math.random() - 0.5) * 0.35;
      this.r   = Math.random() * 1.5 + 0.4;
      this.a   = Math.random() * 0.5 + 0.1;
      /* Mix of cyan and violet particles */
      this.col = Math.random() > 0.55 ? '0,207,255' : '110,40,217';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (
        this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height
      ) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.a;
      ctx.fillStyle   = `rgb(${this.col})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const COUNT = Math.min(80, Math.floor(window.innerWidth / 16));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.update();
      p.draw();

      /* Draw connecting lines to nearby particles */
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d  = Math.hypot(dx, dy);

        if (d < 95) {
          ctx.save();
          ctx.globalAlpha = (1 - d / 95) * 0.12;
          ctx.strokeStyle = '#00CFFF';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    });

    requestAnimationFrame(loop);
  }
  loop();
}


/* ─────────────────────────────────────────────────────────────
   3. TYPEWRITER EFFECT
   Reveals the hero eyebrow text character by character.
   Gives a live-terminal / code-typing feel.
───────────────────────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('hero-eyebrow');
  if (!el) return;

  const original = el.textContent.trim();
  el.textContent  = '';
  let i = 0;

  function type() {
    if (i < original.length) {
      el.textContent += original[i++];
      setTimeout(type, 52);
    }
  }

  /* Small delay so it starts after page load feels settled */
  setTimeout(type, 700);
}


/* ─────────────────────────────────────────────────────────────
   4. COUNTER ANIMATION
   Animates the stat numbers in the About section from 0 to their
   final value when they scroll into view.
───────────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  /**
   * Eased counter increment using requestAnimationFrame.
   * @param {Element} el      — the target element
   * @param {number}  end     — target number
   * @param {number}  suffix  — appended string (e.g. "+")
   * @param {number}  duration — ms
   */
  function animateCount(el, end, suffix, duration) {
    let start    = 0;
    const step   = 16;
    const steps  = duration / step;
    let  current = 0;

    const timer = setInterval(() => {
      current++;
      /* Ease-out: progress accelerates then decelerates */
      const progress = current / steps;
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(eased * end);
      el.textContent = value + suffix;
      if (current >= steps) {
        el.textContent = end + suffix;
        clearInterval(timer);
      }
    }, step);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const end    = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        animateCount(el, end, suffix, 1200);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}


/* ─────────────────────────────────────────────────────────────
   5. SCROLL REVEAL
   Uses IntersectionObserver to add `.visible` to `.reveal`
   elements as they enter the viewport.
───────────────────────────────────────────────────────────── */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  reveals.forEach(el => obs.observe(el));
}


/* ─────────────────────────────────────────────────────────────
   6. SKILL BAR FILL
   Animates .sk-fill bars to their data-w% width when the
   parent skill card scrolls into view.
───────────────────────────────────────────────────────────── */
function initSkillBars() {
  const cards = document.querySelectorAll('.skill-card');
  if (!cards.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.sk-fill');
        fills.forEach((fill, idx) => {
          const targetWidth = fill.getAttribute('data-w');
          setTimeout(() => {
            fill.style.width = targetWidth + '%';
          }, idx * 130 + 250);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  cards.forEach(c => obs.observe(c));
}


/* ─────────────────────────────────────────────────────────────
   7. ACTIVE NAV LINK HIGHLIGHT
   Highlights the corresponding nav link as its section
   enters the viewport.
───────────────────────────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('#nav-links a:not(.nav-btn)');
  if (!sections.length || !links.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}


/* ─────────────────────────────────────────────────────────────
   8. NAV SCROLL COMPRESSION
   Adds .scrolled class to nav when user scrolls past 70px,
   shrinking padding for a compact appearance.
───────────────────────────────────────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 70);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ─────────────────────────────────────────────────────────────
   9. MOBILE NAV (Hamburger + Overlay)
───────────────────────────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('mobile-overlay');
  if (!hamburger || !overlay) return;

  /* Expose globally so onclick="" in HTML still works */
  window.toggleMobileNav = function () {
    hamburger.classList.toggle('open');
    overlay.classList.toggle('open');
    /* Prevent body scroll when overlay is open */
    document.body.style.overflow =
      overlay.classList.contains('open') ? 'hidden' : '';
  };

  window.closeMobileNav = function () {
    hamburger.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* Close if user clicks outside a link */
  overlay.addEventListener('click', e => {
    if (e.target === overlay) window.closeMobileNav();
  });

  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      window.closeMobileNav();
    }
  });
}


/* ─────────────────────────────────────────────────────────────
   10. SMOOTH ANCHOR SCROLLING
   Overrides default jump-scroll for all internal # links,
   adds offset for the fixed nav bar height.
───────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id     = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      const navH   = document.getElementById('nav')?.offsetHeight || 70;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   11. CURSOR GLOW FOLLOWER (desktop only)
   A soft, large radial gradient tracks the cursor,
   giving a subtle depth to hovering over the page.
   Disabled on touch/mobile to save resources.
───────────────────────────────────────────────────────────── */
function initCursorGlow() {
  /* Only desktop */
  if (window.innerWidth <= 900 || window.matchMedia('(pointer:coarse)').matches) return;

  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position:        'fixed',
    pointerEvents:   'none',
    zIndex:          '9998',
    width:           '340px',
    height:          '340px',
    borderRadius:    '50%',
    background:      'radial-gradient(circle, rgba(0,207,255,0.042), transparent 65%)',
    transform:       'translate(-50%, -50%)',
    left:            '-9999px',
    top:             '-9999px',
    transition:      'left 0.07s linear, top 0.07s linear',
    willChange:      'left, top',
  });
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });

  /* Hide when cursor leaves window */
  document.addEventListener('mouseleave', () => {
    glow.style.left = '-9999px';
    glow.style.top  = '-9999px';
  });
}


/* ─────────────────────────────────────────────────────────────
   12. CARD TILT ON MOUSE
   Adds a subtle 3-D perspective tilt to project cards as
   the mouse moves across them — a premium micro-interaction.
───────────────────────────────────────────────────────────── */
function initCardTilt() {
  /* Only for non-touch devices */
  if (window.matchMedia('(pointer:coarse)').matches) return;

  const cards = document.querySelectorAll('.proj-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const dx     = (x - cx) / cx;   /* -1 … +1 */
      const dy     = (y - cy) / cy;
      const rotX   = -dy * 5;          /* max ±5° */
      const rotY   =  dx * 5;

      card.style.transform = `
        translateY(-7px)
        perspective(600px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   13. SCROLL PROGRESS BAR
   A thin line across the top of the viewport showing how far
   the user has scrolled down the page.
───────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position:        'fixed',
    top:             '0',
    left:            '0',
    height:          '2px',
    width:           '0%',
    background:      'linear-gradient(90deg, #00CFFF, #6E28D9)',
    zIndex:          '9999',
    pointerEvents:   'none',
    transition:      'width 0.1s linear',
    willChange:      'width',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrolled  = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }, { passive: true });
}


/* ─────────────────────────────────────────────────────────────
   14. INIT — wire everything up after DOM is ready
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPCBCanvas();       /* 1. Animated PCB circuit traces  */
  initParticleCanvas();  /* 2. Floating particle field      */
  initTypewriter();      /* 3. Hero eyebrow typewriter      */
  initCounters();        /* 4. Animated stat counters       */
  initReveal();          /* 5. Scroll-reveal elements       */
  initSkillBars();       /* 6. Skill bar fill animations    */
  initActiveNav();       /* 7. Active nav link              */
  initNavScroll();       /* 8. Nav compression on scroll    */
  initMobileNav();       /* 9. Hamburger + overlay          */
  initSmoothScroll();    /* 10. Smooth anchor scrolling      */
  initCursorGlow();      /* 11. Cursor glow follower         */
  initCardTilt();        /* 12. Card 3-D tilt               */
  initScrollProgress();  /* 13. Scroll progress bar          */
});
