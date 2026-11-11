// AD-Handwerk – Werke

// ── Burger Menü ──
(function () {
  const navOverlay  = document.getElementById('ueber-nav-overlay');
  const navBackdrop = document.getElementById('ueberNavBackdrop');

  function openNav() {
    navOverlay.classList.add('open');
    navBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    navOverlay.classList.remove('open');
    navBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function positionNavItems() {
    const svg = document.querySelector('.ueber-nav-grafik');
    if (!navOverlay || !svg) return;
    const oRect = navOverlay.getBoundingClientRect();
    const sRect = svg.getBoundingClientRect();
    document.querySelectorAll('.ueber-nav-item[data-dot-x], .ueber-nav-btns[data-dot-x]').forEach(item => {
      const dotX = parseFloat(item.dataset.dotX);
      item.style.left = (sRect.left - oRect.left) + dotX * sRect.width + 'px';
    });
  }

  document.getElementById('ueberBurgerBtn').addEventListener('click', openNav);
  document.getElementById('ueberNavClose').addEventListener('click', closeNav);
  navBackdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  window.addEventListener('resize', positionNavItems);
  window.addEventListener('load', positionNavItems);
})();

// ── Scroll Prompt ausblenden ──
(function () {
  const wrap = document.querySelector('.werke-scroll-prompt-wrap');
  if (!wrap) return;
  window.addEventListener('scroll', () => {
    wrap.classList.toggle('hidden', window.scrollY > 60);
  }, { passive: true });

  const link = wrap.querySelector('.scroll-prompt');
  if (link) link.addEventListener('click', e => {
    e.preventDefault();
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  });
})();

// ── Impressum ──
(function () {
  const imp = document.getElementById('impressum');

  window.addEventListener('scroll', () => {
    if (imp.classList.contains('open')) return;
    const nearBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight < 10;
    if (nearBottom) imp.classList.add('visible');
    else imp.classList.remove('visible', 'open', 'full', 'kontakt', 'rechtliches');
  }, { passive: true });

  let scrollY = 0;
  function lockScroll() {
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  }
  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }

  document.getElementById('impressumToggle').addEventListener('click', () => {
    if (imp.classList.contains('open')) {
      imp.classList.remove('open');
      unlockScroll();
    } else {
      imp.classList.add('visible', 'open');
      lockScroll();
    }
  });
  const closeImp = () => {
    imp.classList.remove('open', 'full', 'kontakt', 'rechtliches');
    unlockScroll();
  };
  document.getElementById('impressumClose').addEventListener('click', closeImp);
  document.getElementById('openImpressum').addEventListener('click', e => { e.preventDefault(); imp.classList.add('full'); });
  document.getElementById('impressumBack2').addEventListener('click', () => imp.classList.remove('full'));
  document.getElementById('impressumClose2').addEventListener('click', closeImp);
  document.getElementById('impressumClose3').addEventListener('click', closeImp);
  document.getElementById('impressumClose4').addEventListener('click', closeImp);
  document.getElementById('openRechtliches').addEventListener('click', e => { e.preventDefault(); imp.classList.add('rechtliches'); });
  document.getElementById('impressumBack3').addEventListener('click', () => imp.classList.remove('rechtliches'));
  document.getElementById('openKontakt').addEventListener('click', e => { e.preventDefault(); imp.classList.add('kontakt'); });
  document.getElementById('impressumBack4').addEventListener('click', () => imp.classList.remove('kontakt'));
  document.addEventListener('click', e => {
    if (imp.classList.contains('open') && (!imp.contains(e.target) || e.target === imp)) closeImp();
  });
})();

// ── Produkte im Regal: Blob-Overlay (Illustration → echte Fotos) ──
(function () {
  if (typeof PRODUKTE === 'undefined') return;

  const $ = id => document.getElementById(id);
  const overlay  = $('produktOverlay');
  const backdrop = $('produktBackdrop');
  if (!overlay) return;

  let aktuell = null;   // { id, p, btn, foto }
  let schliessTimer = null;

  const png  = id => `media/produkte/ad_produkt_${id}.png`;
  const avif = id => `media/produkte/ad_produkt_${id}.avif`;

  // Titel der Stücke aus den Daten in die Hover-Blasen schreiben
  document.querySelectorAll('.regal-produkt').forEach(btn => {
    const p = PRODUKTE[btn.dataset.produkt];
    if (!p) return;
    btn.querySelector('.produkt-label').textContent = p.titel;
    btn.setAttribute('aria-label', p.titel + ' – Details ansehen');
  });

  function schritt(n) {
    $('produktStep1').hidden = n !== 1;
    $('produktStep2').hidden = n !== 2;
    $('produktZurueck').hidden = n !== 2;
    overlay.classList.toggle('schritt2', n === 2);
  }

  // Blob wächst aus dem angeklickten Stück heraus
  function setzeUrsprung(btn) {
    const r = btn.getBoundingClientRect();
    const w = overlay.offsetWidth, h = overlay.offsetHeight;
    const links = (window.innerWidth - w) / 2, oben = (window.innerHeight - h) / 2;
    const ox = ((r.left + r.width / 2 - links) / w * 100).toFixed(1);
    const oy = ((r.top + r.height / 2 - oben) / h * 100).toFixed(1);
    overlay.style.transformOrigin = `${ox}% ${oy}%`;
  }

  function zeigeFoto(i) {
    const p = aktuell.p, img = $('produktFoto');
    const n = p.fotos.length;
    // Pfeile nur bei mehreren Fotos (der Platz bleibt, damit das Foto nicht springt)
    ['produktPrev', 'produktNext'].forEach(id => $(id).classList.toggle('aus', n < 2));
    $('produktFotoPlatzhalter').hidden = n > 0;
    img.hidden = n === 0;
    if (!n) return;
    aktuell.foto = (i + n) % n;
    const f = p.fotos[aktuell.foto];
    img.src = f.src;
    img.alt = f.alt || p.titel;
    img.style.objectPosition = f.pos || '50% 50%';
  }

  function oeffne(btn) {
    const id = btn.dataset.produkt, p = PRODUKTE[id];
    if (!p) return;
    aktuell = { id, p, btn, foto: 0 };

    // erster Schritt: freigestelltes Foto, falls vorhanden, sonst die Illustration
    $('produktIlluAvif').srcset = p.freisteller ? p.freisteller + '.avif' : avif(id);
    $('produktIllu').src = p.freisteller ? p.freisteller + '.png' : png(id);
    $('produktIllu').alt = p.titel;
    $('produktFotoIllu').src = png(id);
    $('produktTitel').textContent = p.titel;
    // Angaben in [eckigen Klammern] sind Platzhalter und werden nicht angezeigt
    const echt = t => typeof t === 'string' && t.trim() !== '' && !t.trim().startsWith('[');
    $('produktJahr').textContent = echt(p.jahr) ? p.jahr : '';
    $('produktJahr').hidden = !echt(p.jahr);
    $('produktMasse').textContent = echt(p.masse) ? p.masse : '';
    $('produktMasse').hidden = !echt(p.masse);
    const liste = $('produktListe');
    const zeilen = p.liste.filter(echt);
    liste.replaceChildren(...zeilen.map(zeile => {
      const li = document.createElement('li');
      li.textContent = zeile;
      return li;
    }));
    liste.hidden = zeilen.length === 0;

    schritt(1);
    zeigeFoto(0);
    $('produktFotosBtn').disabled = p.fotos.length === 0;   // ohne Fotos ausgegraut
    setzeUrsprung(btn);
    clearTimeout(schliessTimer);   // ein laufendes Zurücksetzen vom letzten Schließen darf das neue Öffnen nicht überschreiben
    overlay.classList.remove('closing');
    overlay.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    $('produktClose').focus({ preventScroll: true });
  }

  function schliesse() {
    if (!aktuell) return;
    const btn = aktuell.btn;
    aktuell = null;
    overlay.classList.remove('open');
    overlay.classList.add('closing');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    schliessTimer = setTimeout(() => {
      overlay.classList.remove('closing');
      schritt(1);
    }, 400);
    btn.focus({ preventScroll: true });
  }

  document.querySelectorAll('.regal-produkt').forEach(btn => btn.addEventListener('click', () => oeffne(btn)));
  $('produktClose').addEventListener('click', schliesse);
  backdrop.addEventListener('click', schliesse);
  $('produktFotosBtn').addEventListener('click', () => { schritt(2); });
  $('produktZurueck').addEventListener('click', () => schritt(1));
  $('produktPrev').addEventListener('click', () => zeigeFoto(aktuell.foto - 1));
  $('produktNext').addEventListener('click', () => zeigeFoto(aktuell.foto + 1));

  document.addEventListener('keydown', e => {
    if (!aktuell) return;
    if (e.key === 'Escape') schliesse();
    else if (e.key === 'ArrowLeft' && !$('produktStep2').hidden && aktuell.p.fotos.length > 1) zeigeFoto(aktuell.foto - 1);
    else if (e.key === 'ArrowRight' && !$('produktStep2').hidden && aktuell.p.fotos.length > 1) zeigeFoto(aktuell.foto + 1);
  });

  // Wischen durch die Fotos (Handy)
  let touchX = null;
  const foto = $('produktStep2');
  foto.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  foto.addEventListener('touchend', e => {
    if (touchX === null || !aktuell || aktuell.p.fotos.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 40) zeigeFoto(aktuell.foto + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
