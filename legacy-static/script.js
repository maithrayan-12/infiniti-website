(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header shadow + mobile menu ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const menuBtn = $('#menu-btn');
  const navLinks = $('#nav-links');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- Marquee: duplicate content for a seamless loop ---------- */
  const track = $('#marquee-track');
  if (track) {
    const group = track.firstElementChild;
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
    if (reduceMotion) clone.style.display = 'none';
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Count-up stats ---------- */
  const animateNumber = (el, to, duration = 1400) => {
    if (reduceMotion) { el.textContent = to; return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(to * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          animateNumber(en.target, Number(en.target.dataset.count));
          co.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---------- Hero parallax (pointer) ---------- */
  const art = $('.hero-art');
  if (art && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const layers = $$('.layer', art);
    art.addEventListener('pointermove', (e) => {
      const r = art.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((l) => {
        const d = Number(l.dataset.depth || 10);
        l.style.transform = `translate3d(${x * d * 2}px, ${y * d * 2}px, 0)`;
      });
    });
    art.addEventListener('pointerleave', () => layers.forEach((l) => (l.style.transform = '')));
  }
  if (reduceMotion) {
    const svg = $('.infinity');
    if (svg && svg.pauseAnimations) svg.pauseAnimations();
  }

  /* ---------- Process tabs ---------- */
  const tabs = $$('.step');
  const panels = $$('.panel');
  const fill = $('#progress-fill');
  const label = $('#progress-label');
  const nextBtn = $('#next-step');
  let current = 0;

  const showStep = (i, focus = false) => {
    current = (i + tabs.length) % tabs.length;
    tabs.forEach((t, idx) => {
      const active = idx === current;
      t.classList.toggle('is-active', active);
      t.classList.toggle('is-done', idx < current);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    panels.forEach((p, idx) => {
      const active = idx === current;
      p.classList.toggle('is-active', active);
      p.hidden = !active;
    });
    fill.style.width = `${((current + 1) / tabs.length) * 100}%`;
    label.textContent = `Step ${current + 1} of ${tabs.length}`;
    nextBtn.firstChild.textContent = current === tabs.length - 1 ? 'Start over ' : 'Next step ';
    if (focus) tabs[current].focus();
    tabs[current].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  tabs.forEach((t, idx) => t.addEventListener('click', () => showStep(idx)));
  $('.steps').addEventListener('keydown', (e) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in keys) { e.preventDefault(); showStep(current + keys[e.key], true); }
    if (e.key === 'Home') { e.preventDefault(); showStep(0, true); }
    if (e.key === 'End') { e.preventDefault(); showStep(tabs.length - 1, true); }
  });
  nextBtn.addEventListener('click', () => showStep(current + 1));

  /* ---------- Compare toggle ---------- */
  const toggle = $('.toggle');
  const compare = $('#compare');
  $$('.toggle-btn', toggle).forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      toggle.dataset.mode = mode;
      compare.dataset.mode = mode;
      $$('.toggle-btn', toggle).forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
    });
  });

  /* ---------- Savings calculator ---------- */
  const INFINITI_RATE = 0.12;
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const hires = $('#hires'), salary = $('#salary'), fee = $('#fee');
  const out = {
    hires: $('#hires-out'), salary: $('#salary-out'), fee: $('#fee-out'),
    total: $('#savings-total'), agency: $('#cost-agency'), inf: $('#cost-inf'),
    barAgency: $('#bar-agency'), barInf: $('#bar-inf'),
  };
  let shown = { total: 0, agency: 0, inf: 0 };
  let raf;

  const setRangeFill = (input) => {
    const p = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--p', `${p}%`);
  };

  const tween = (from, to, onUpdate, duration = 500) => {
    cancelAnimationFrame(raf);
    if (reduceMotion) { onUpdate(to); return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 3);
      onUpdate(from + (to - from) * e);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  const calc = () => {
    const h = Number(hires.value), s = Number(salary.value), f = Number(fee.value) / 100;
    out.hires.textContent = h;
    out.salary.textContent = money.format(s);
    out.fee.textContent = `${fee.value}%`;
    [hires, salary, fee].forEach(setRangeFill);

    const agency = h * s * f;
    const inf = h * s * INFINITI_RATE;
    const saving = Math.max(agency - inf, 0);
    const base = Math.max(agency, inf, 1);
    out.barAgency.style.setProperty('--w', `${(agency / base) * 100}%`);
    out.barInf.style.setProperty('--w', `${(inf / base) * 100}%`);

    const from = { ...shown };
    tween(0, 1, (t) => {
      const lerp = (a, b) => a + (b - a) * t;
      shown = { total: lerp(from.total, saving), agency: lerp(from.agency, agency), inf: lerp(from.inf, inf) };
      out.total.textContent = money.format(shown.total);
      out.agency.textContent = money.format(shown.agency);
      out.inf.textContent = money.format(shown.inf);
    });
  };
  [hires, salary, fee].forEach((i) => i.addEventListener('input', calc));
  calc();

  /* ---------- Contact form (client-side demo) ---------- */
  const form = $('#contact-form');
  const status = $('#form-status');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setError = (input, msg) => {
    const field = input.closest('.field');
    const err = $(`#${input.id}-err`);
    field.classList.toggle('invalid', Boolean(msg));
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg || '';
  };

  const validators = {
    name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
    email: (v) => (!emailRe.test(v.trim()) ? 'Please enter a valid work email.' : ''),
    message: (v) => (v.trim().length < 10 ? 'Tell us a little about the roles (10+ characters).' : ''),
  };

  Object.keys(validators).forEach((id) => {
    const el = $(`#${id}`);
    el.addEventListener('blur', () => setError(el, validators[id](el.value)));
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('invalid')) setError(el, validators[id](el.value)); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstBad = null;
    Object.keys(validators).forEach((id) => {
      const el = $(`#${id}`);
      const msg = validators[id](el.value);
      setError(el, msg);
      if (msg && !firstBad) firstBad = el;
    });
    if (firstBad) { firstBad.focus(); status.textContent = ''; return; }

    // TODO: connect to your backend / form service (e.g. fetch('/api/contact', { method: 'POST', body: new FormData(form) }))
    status.textContent = `Thanks, ${$('#name').value.trim().split(' ')[0]}! We'll be in touch within one business day.`;
    form.reset();
  });
})();
