'use strict';
document.addEventListener('DOMContentLoaded', () => {

  /* PRELOADER */
  const pre = document.getElementById('preloader');
  window.addEventListener('load', () => setTimeout(() => pre.classList.add('gone'), 1900));

  /* NAVBAR */
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 30), { passive: true });

  /* BURGER */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('nav-menu');
  burger.addEventListener('click', () => {
    const o = burger.classList.toggle('open');
    menu.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }));
  document.querySelectorAll('.nl.has-drop').forEach(el => {
    el.addEventListener('click', e => {
      if (window.innerWidth <= 768) { e.preventDefault(); el.classList.toggle('expanded'); }
    });
  });

  /* HERO SLIDER */
  const slides = document.querySelectorAll('.hs');
  const dots = document.querySelectorAll('.hd');
  let cur = 0, si;
  function goSlide(n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
  }
  function startSlider() { si = setInterval(() => goSlide(cur + 1), 5500); }
  dots.forEach(d => d.addEventListener('click', () => { clearInterval(si); goSlide(+d.dataset.i); startSlider(); }));
  if (slides.length) startSlider();

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.offsetTop - 72, behavior: 'smooth' });
    });
  });

  /* LIGHTBOX */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  let lbArr = [], lbI = 0;
  document.querySelectorAll('.mi').forEach(mi => {
    mi.addEventListener('click', () => {
      const sec = mi.closest('.gallery-sec');
      lbArr = [...sec.querySelectorAll('.mi img')];
      lbI = lbArr.indexOf(mi.querySelector('img'));
      showLb(lbI);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  function showLb(i) {
    lbI = (i + lbArr.length) % lbArr.length;
    lbImg.src = lbArr[lbI].src;
  }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  document.getElementById('lb-close').addEventListener('click', closeLb);
  document.getElementById('lb-prev').addEventListener('click', e => { e.stopPropagation(); showLb(lbI - 1); });
  document.getElementById('lb-next').addEventListener('click', e => { e.stopPropagation(); showLb(lbI + 1); });
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLb(lbI - 1);
    if (e.key === 'ArrowRight') showLb(lbI + 1);
  });

  /* SCROLL REVEAL */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.rv')];
      setTimeout(() => entry.target.classList.add('in'), siblings.indexOf(entry.target) * 85);
      ro.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.sec-hd,.wcard,.mi,.bcard,.about-img-side,.about-txt,.ci,.contact-form-box,.fc,.footer-brand').forEach(el => {
    el.classList.add('rv'); ro.observe(el);
  });

  /* CONTACT FORM */
  const form = document.getElementById('contact-form');
  const succ = document.getElementById('f-success');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const n = document.getElementById('c-name').value.trim();
      const p = document.getElementById('c-phone').value.trim();
      const s = document.getElementById('c-service').value;
      if (!n || !p || !s) { shakeEl(form.querySelector('.btn-gold')); return; }
      form.style.display = 'none'; succ.classList.add('show');
    });
  }
  function shakeEl(el) {
    el.style.animation = 'none'; el.offsetHeight;
    el.style.animation = 'shake .4s ease';
    el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  }
  const ss = document.createElement('style');
  ss.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}';
  document.head.appendChild(ss);

  /* BACK TO TOP */
  const fab = document.getElementById('fab-top');
  window.addEventListener('scroll', () => fab.classList.toggle('show', scrollY > 500), { passive: true });
  fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Mark images as loaded (hides placeholders) */
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'));
  });

  /* WORK CARD 3D TILT */
  document.querySelectorAll('.wcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - .5) * 10;
      const y = ((e.clientY - r.top) / r.height - .5) * 10;
      card.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

});
