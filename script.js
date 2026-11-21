document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.year').forEach(node => node.textContent = new Date().getFullYear());
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('open', !open);
    document.body.classList.toggle('nav-open', !open);
  });
  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.slide-dots button')];
  let current = 0;
  let timer;
  const show = index => {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => { dot.classList.toggle('active', i === current); dot.setAttribute('aria-current', i === current ? 'true' : 'false'); });
  };
  const restart = () => { clearInterval(timer); if (slides.length > 1) timer = setInterval(() => show(current + 1), 6500); };
  dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.go)); restart(); }));
  document.querySelector('.slide-arrow.next')?.addEventListener('click', () => { show(current + 1); restart(); });
  document.querySelector('.slide-arrow.prev')?.addEventListener('click', () => { show(current - 1); restart(); });
  restart();
  document.querySelectorAll('[data-comparison]').forEach(frame => {
    const range = frame.querySelector('.compare-range');
    const update = () => frame.style.setProperty('--reveal', `${range.value}%`);
    range?.addEventListener('input', update);
    update();
  });
  const revealTargets = document.querySelectorAll('.service-row, .gallery-card, .work-tile, .value-card, .contact-detail, .about-text, .about-stamp');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.transitionDelay = `${(index % 3) * 75}ms`;
      observer.observe(target);
    });
  }
  const form = document.querySelector('.quote-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent(`Website enquiry — ${data.get('service')}`);
    const body = encodeURIComponent(`Hello Odamblason Auto Painters,\n\nMy name is ${data.get('name')}.\nMy phone number is ${data.get('phone')}.\nI am interested in: ${data.get('service')}.\n\n${data.get('message') || ''}\n\nThank you.`);
    window.location.href = `mailto:odamblasonautopainters@gmail.com?subject=${subject}&body=${body}`;
  });
});