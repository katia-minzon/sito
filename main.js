// Katia Minzon – interazioni del sito
(function () {
  // Menu mobile
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Ombra header allo scroll
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Animazioni delicate allo scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Schede "Quando rivolgersi" (tab accessibili, frecce da tastiera)
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      let n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); select(n); n.focus(); }
    });
  });

  // Modulo contatti (Formspree, gratuito)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = 'Controlla i campi obbligatori: nome, telefono e consenso privacy.';
      const first = form.querySelector(':invalid'); if (first) first.focus();
      return;
    }
    if (form.action.includes('[ID-FORMSPREE]')) {
      status.textContent = 'Il modulo non è ancora attivo: per ora chiamami o scrivimi su WhatsApp.';
      return;
    }
    status.textContent = 'Invio in corso…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { form.reset(); status.textContent = 'Grazie! Ho ricevuto la tua richiesta e ti ricontatterò presto.'; }
      else throw new Error();
    } catch {
      status.textContent = 'Qualcosa non ha funzionato. Riprova o contattami per telefono.';
    }
  });

  document.getElementById('y').textContent = new Date().getFullYear();
})();
