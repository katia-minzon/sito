// Katia Minzon – interazioni del sito
(function () {
  // ---------- Menu mobile ----------
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Chiudi' : 'Menu';
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ---------- Segni di pregrafismo (onde, occhielli, ponti) ----------
  const patterns = {
    // onde: ~~~~
    wave(w, h) {
      const p = 36, a = h * 0.32, m = h / 2;
      let d = `M2 ${m}`;
      for (let x = 2; x < w - p; x += p) d += ` Q${x + p / 4} ${m - a} ${x + p / 2} ${m} T${x + p} ${m}`;
      return d;
    },
    // occhielli: llllll (il corsivo dei primi quaderni)
    loops(w, h) {
      const p = 30, base = h - 6, top = 4;
      let d = `M2 ${base}`;
      for (let x = 2; x < w - p; x += p) {
        d += ` C${x + p * 0.75} ${base} ${x + p * 1.05} ${top} ${x + p * 0.62} ${top}`;
        d += ` C${x + p * 0.25} ${top} ${x + p * 0.45} ${base} ${x + p} ${base}`;
      }
      return d;
    },
    // ponti: nnnnn
    arches(w, h) {
      const p = 34, base = h - 4, top = 6;
      let d = `M2 ${base}`;
      for (let x = 2; x < w - p; x += p) d += ` C${x} ${top} ${x + p} ${top} ${x + p} ${base}`;
      return d;
    },
  };

  const drawSign = (svg) => {
    const w = Math.round(svg.getBoundingClientRect().width) || 600;
    const h = Math.round(svg.getBoundingClientRect().height) || 40;
    const d = patterns[svg.dataset.pattern](w, h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = `<path d="${d}" stroke="${svg.dataset.stroke}" stroke-width="${svg.dataset.width || 2.5}"/>`;
  };
  const signs = document.querySelectorAll('svg[data-pattern]');
  signs.forEach(drawSign);
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => signs.forEach((s) => { drawSign(s); setLen(s); }), 200); });

  const setLen = (svg) => svg.querySelectorAll('path').forEach((p) => {
    const len = Math.ceil(p.getTotalLength());
    p.style.setProperty('--len', len);
  });
  document.querySelectorAll('.draw').forEach(setLen);

  // ---------- Animazioni allo scroll ----------
  const items = document.querySelectorAll('.reveal, .draw');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add('in'));

  // ---------- Checklist "Quando chiamarmi" ----------
  const boxes = document.querySelectorAll('#checklist input[type="checkbox"]');
  const count = document.getElementById('count');
  const text = document.getElementById('tallyText');
  const msg = (n) => {
    if (n === 0) return 'frasi segnate. Non devi avere tutte le risposte: per un primo confronto basta una telefonata.';
    if (n === 1) return 'frase segnata. Anche un solo dubbio merita di essere ascoltato: parliamone.';
    if (n <= 3) return 'frasi segnate. Un primo colloquio ti aiuta a capire se e come posso esserti utile.';
    return 'frasi segnate. Vale la pena parlarne con calma: ti ascolto senza giudizio.';
  };
  boxes.forEach((b) => b.addEventListener('change', () => {
    const n = [...boxes].filter((x) => x.checked).length;
    count.textContent = n;
    text.textContent = msg(n);
  }));

  // ---------- Modulo contatti (Formspree, gratuito) ----------
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = 'Controlla i campi obbligatori: nome, telefono e consenso privacy.';
      const first = form.querySelector(':invalid'); if (first) first.focus();
      return;
    }
    if (form.action.includes('%5BID-FORMSPREE%5D') || form.action.includes('[ID-FORMSPREE]')) {
      status.textContent = 'Il modulo non è ancora attivo: per ora chiamami o scrivimi su WhatsApp.';
      return;
    }
    status.textContent = 'Invio in corso…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error();
      form.reset();
      status.textContent = 'Grazie! Ho ricevuto la tua richiesta e ti ricontatterò presto.';
    } catch {
      status.textContent = 'Qualcosa non ha funzionato. Riprova o contattami per telefono.';
    }
  });

  document.getElementById('y').textContent = new Date().getFullYear();
})();
