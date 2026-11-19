// AD-Handwerk – Werke

// ── Burger Menü ──
(function () {
  const navOverlay  = document.getElementById('ueber-nav-overlay');
  const navBackdrop = document.getElementById('ueberNavBackdrop');

  // Handy: eigenes Menü (Seite von unten, wie auf Über uns), Scrollen dabei komplett gesperrt
  const mobilMenue = document.getElementById('ueberMobilMenue');
  const handyMenue = () => window.matchMedia('(max-width: 768px)').matches && mobilMenue;
  let menueScrollY = 0;
  if (mobilMenue) {
    mobilMenue.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    mobilMenue.addEventListener('wheel', e => e.preventDefault(), { passive: false });
  }

  function openNav() {
    if (handyMenue()) {
      mobilMenue.classList.add('open');
      mobilMenue.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menue-offen');
      menueScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + menueScrollY + 'px';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return;
    }
    navOverlay.classList.add('open');
    navBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    if (mobilMenue && mobilMenue.classList.contains('open')) {
      mobilMenue.classList.remove('open');
      mobilMenue.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menue-offen');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, menueScrollY);
      return;
    }
    navOverlay.classList.remove('open');
    navBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (document.getElementById('mmZu')) document.getElementById('mmZu').addEventListener('click', closeNav);
  // Zurück-Taste (Safari stellt die Seite aus dem Zwischenspeicher genau so wieder her, wie man sie verlassen hat):
  // war beim Weggehen das Menü offen, wird es beim Zurückkommen geschlossen
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    const mm = document.getElementById('ueberMobilMenue');
    const nav = document.getElementById('ueber-nav-overlay');
    if ((mm && mm.classList.contains('open')) || (nav && nav.classList.contains('open'))) closeNav();
  });
  // "Werke" im Handy-Menü: man ist schon hier -> nur schließen
  if (mobilMenue) mobilMenue.querySelector('.mi-werke').addEventListener('click', e => { e.preventDefault(); closeNav(); });

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
  // Am Computer reicht overflow:hidden (die Seite bleibt, wo sie ist – der Punkte-Hintergrund springt nicht);
  // nur am Handy die Seite festsetzen (iOS ignoriert overflow:hidden)
  const handySperre = () => window.matchMedia('(max-width: 768px)').matches;
  function lockScroll() {
    if (!handySperre()) { document.documentElement.style.overflow = 'hidden'; return; }
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  }
  function unlockScroll() {
    if (document.documentElement.style.overflow === 'hidden') { document.documentElement.style.overflow = ''; return; }
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
    $('produktJahr').textContent = '';
    $('produktJahr').hidden = true;   // Jahreszahl wird nirgends mehr angezeigt
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
    baueSeiten(p);
    $('produktFotosBtn').disabled = p.fotos.length === 0;   // ohne Fotos ausgegraut
    setzeUrsprung(btn);
    clearTimeout(schliessTimer);   // ein laufendes Zurücksetzen vom letzten Schließen darf das neue Öffnen nicht überschreiben
    overlay.classList.remove('closing');
    overlay.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    $('produktClose').focus({ preventScroll: true });
  }

  // ── Computer: im selben Blob weiterblättern (Seite 1 = Stück + Angaben, danach je ein Foto, das den Blob füllt) ──
  const seiten = $('popSeiten'), punkte = $('popPunkte');
  function seitenBreite() { return seiten ? seiten.clientWidth : 1; }
  function aktuelleSeite() { return Math.round(seiten.scrollLeft / seitenBreite()); }
  function markiere() {
    if (!seiten) return;
    const i = aktuelleSeite(), n = seiten.children.length;
    punkte.querySelectorAll('.pop-punkt').forEach((b, j) => b.classList.toggle('aktiv', j === i));
    $('popZurueck').hidden = i <= 0;
    $('popWeiter').hidden = n < 2;   // auch beim letzten Bild da: springt dann zurück zum Anfang
    // Erklärung beim Hover und: auf der Infoseite liegt der Pfeil nur auf Terracotta -> ohne Schatten
    $('popWeiterLabel').textContent = i === 0 ? 'Zu den Fotos' : (i >= n - 1 ? 'Zum Anfang' : 'Weiter');
    $('popZurueckLabel').textContent = i <= 1 ? 'Zum Werk' : 'Zurück';
    overlay.classList.toggle('pop-infoseite', i === 0);
  }
  function geheZu(i) { seiten.scrollTo({ left: i * seitenBreite(), behavior: 'smooth' }); }
  function baueSeiten(p) {
    if (!seiten) return;
    seiten.querySelectorAll('.pop-seite-foto').forEach(s => s.remove());
    p.fotos.forEach((f, n) => {
      const s = document.createElement('div');
      s.className = 'pop-seite pop-seite-foto';
      const im = document.createElement('img');
      im.src = f.src; im.alt = f.alt || ''; im.style.objectPosition = f.pos || '50% 55%';
      im.loading = n < 2 ? 'eager' : 'lazy'; im.decoding = 'async'; im.draggable = false;
      s.appendChild(im);
      seiten.appendChild(s);
    });
    const n = seiten.children.length;
    punkte.replaceChildren(...Array.from({ length: n }, (_, j) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'pop-punkt';
      b.setAttribute('aria-label', 'Bild ' + (j + 1));
      b.addEventListener('click', e => { e.stopPropagation(); geheZu(j); });
      return b;
    }));
    // keine Fotos: statt der Punkte ein Hinweis
    if (n < 2) { const h = document.createElement('span'); h.className = 'keine-fotos'; h.textContent = 'Fotos demnächst!'; punkte.replaceChildren(h); }
    punkte.hidden = false;
    seiten.scrollLeft = 0;
    requestAnimationFrame(markiere);
  }
  // Computer: Zoom auf den Fotos – Klick zoomt an der Stelle hinein, die Maus verschiebt den Ausschnitt,
  // nochmal klicken oder Maus rausziehen = zurück. Beim Blättern wird der Zoom zurückgesetzt.
  function zoomAus() { seiten && seiten.querySelectorAll('.pop-seite-foto img.zoom').forEach(im => { im.classList.remove('zoom'); im.style.transform = ''; }); }
  if (seiten) {
    const ZOOM = 2.5;
    const ursprung = (im, e) => {
      const r = im.getBoundingClientRect();
      im.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
    };
    seiten.addEventListener('click', e => {
      if (handy.matches) return;
      const im = e.target.closest('.pop-seite-foto img');
      if (!im) return;
      e.stopPropagation();
      if (im.classList.contains('zoom')) { zoomAus(); return; }
      ursprung(im, e);
      im.classList.add('zoom');
      im.style.transform = 'scale(' + ZOOM + ')';
    });
    seiten.addEventListener('mousemove', e => {
      const im = e.target.closest('.pop-seite-foto img.zoom');
      if (im) ursprung(im, e);
    });
    seiten.addEventListener('mouseleave', zoomAus);
    seiten.addEventListener('scroll', zoomAus, { passive: true });
  }
  if (seiten) {
    seiten.addEventListener('scroll', markiere, { passive: true });
    $('popZurueck').addEventListener('click', () => geheZu(aktuelleSeite() - 1));
    $('popSchliessen').addEventListener('click', () => schliesse());   // links auf der ersten Seite (dort gibt es kein Zurück)
    const weiter = () => { const i = aktuelleSeite(); geheZu(i >= seiten.children.length - 1 ? 0 : i + 1); };
    $('popWeiter').addEventListener('click', weiter);
    document.addEventListener('keydown', e => {
      if (!aktuell || handy.matches) return;
      if (e.key === 'ArrowRight') weiter();
      else if (e.key === 'ArrowLeft') geheZu(aktuelleSeite() - 1);
    });
  }

  let schliesse = function () {
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

  // Handy: statt des Blob-Pop-ups eine Terracotta-Seite zum Scrollen (oben Stück + Titel + Text, darunter die Fotos groß)
  const handy = window.matchMedia('(max-width: 768px)');
  const gross = { ov: $('werkFotoOverlay'), zu: $('werkFotoClose'), scroll: $('werkScroll'), btn: null };
  // Rechteck mit den unförmigen Ecken des Blob-Kreises (Ecken behalten ihre Größe, nur die Kanten dazwischen wachsen).
  // Pfad aus #blobClip, an den Extrempunkten aufgeschnitten; D = Größe des Kreises, aus dem die Ecken stammen.
  function blobRechteck(w, h) {
    const D = Math.min(w, h) * 0.62, f = n => n.toFixed(1);
    const bx = w - D, by = h - D;
    return `path('M0 ${f(0.50218 * D)} C0 ${f(0.13974 * D)} ${f(0.24873 * D)} 0 ${f(0.44162 * D)} 0 ` +
      `L${f(bx + 0.44162 * D)} 0 C${f(bx + 0.84772 * D)} 0 ${f(w)} ${f(0.20960 * D)} ${f(w)} ${f(0.50218 * D)} ` +
      `L${f(w)} ${f(by + 0.50218 * D)} C${f(bx + 0.99531 * D)} ${f(by + 0.88028 * D)} ${f(bx + 0.70558 * D)} ${f(h)} ${f(bx + 0.44162 * D)} ${f(h)} ` +
      `L${f(0.44162 * D)} ${f(h)} C${f(0.27411 * D)} ${f(h)} 0 ${f(by + 0.91703 * D)} 0 ${f(by + 0.50218 * D)} Z')`;
  }
  function formeKarten() {
    document.querySelectorAll('.werk-karte').forEach(k => {
      k.style.clipPath = blobRechteck(k.offsetWidth, k.offsetHeight);
    });
  }
  window.addEventListener('resize', formeKarten);

  function oeffneGross(btn, abFoto) {
    const id = btn.dataset.produkt, p = PRODUKTE[id];
    if (!p || !gross.ov) return oeffne(btn);
    const echt = t => typeof t === 'string' && t.trim() !== '' && !t.trim().startsWith('[');
    $('werkTitel').textContent = p.titel;
    const el = (tag, cls) => { const e = document.createElement(tag); e.className = cls; return e; };
    // Karte 1: Kurzbeschreibung + freigestelltes Stück (sonst die Illustration)
    const k1 = el('div', 'werk-karte werk-karte-start');
    const txt = el('p', 'werk-karte-text');
    // Angaben in drei Zeilen: Technik | Glasur / Maße / Jahr (mit | statt ·); eigener "text" in produkte.js hat Vorrang
    if (echt(p.text)) txt.textContent = p.text;
    else {
      const zeilen = [p.liste.slice(1).filter(echt).join(' | '), echt(p.masse) ? p.masse.replace(/\s*·\s*/g, ' | ') : ''].filter(echt);   // ohne Jahreszahl
      txt.replaceChildren(...zeilen.flatMap((z, n) => n ? [document.createElement('br'), z] : [z]));
    }
    const stueck = el('img', 'werk-karte-stueck');
    stueck.src = p.freisteller ? p.freisteller + '.png' : png(id);
    stueck.alt = p.titel;
    k1.append(stueck, txt);   // erst das Stück, darunter der Text
    // weitere Karten: die Fotos
    const karten = [k1, ...p.fotos.map(f => {
      const k = el('div', 'werk-karte');
      const im = el('img', 'werk-karte-foto');
      im.src = f.src; im.alt = f.alt || ''; im.style.objectPosition = f.pos || '50% 55%';
      im.loading = 'lazy'; im.decoding = 'async'; im.draggable = false;
      k.appendChild(im);
      return k;
    })];
    const reihe = $('werkKarten');
    reihe.replaceChildren(...karten);
    reihe.scrollLeft = 0;
    const punkte = $('werkPunkte');
    punkte.replaceChildren(...karten.map((_, n) => {
      const b = el('button', 'werk-punkt' + (n === 0 ? ' aktiv' : ''));
      b.type = 'button';
      b.setAttribute('aria-label', 'Bild ' + (n + 1));
      b.addEventListener('click', () => reihe.scrollTo({ left: karten[n].offsetLeft - reihe.firstElementChild.offsetLeft, behavior: 'smooth' }));
      return b;
    }));
    if (karten.length < 2) { const h = el('span', 'keine-fotos'); h.textContent = 'Fotos demnächst!'; punkte.replaceChildren(h); }
    punkte.hidden = false;   // ohne Fotos steht hier der Hinweis statt der Punkte
    gross.btn = btn;
    gross.ov.classList.add('open');
    // Seite dahinter festsetzen (iOS ignoriert overflow:hidden); am Computer reicht overflow:hidden
    gross.y = window.scrollY;
    if (handy.matches) {
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + gross.y + 'px';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      formeKarten();   // Blob-Ecken setzen
      // normal bei der ersten Karte beginnen; über "Mehr Fotos" (Computer) gleich beim ersten Foto
      const ziel = abFoto && karten[1] ? karten[1].offsetLeft - karten[0].offsetLeft : 0;
      reihe.scrollLeft = ziel;
      punkte.querySelectorAll('.werk-punkt').forEach((b, j) => b.classList.toggle('aktiv', j === (ziel ? 1 : 0)));
    });
    setTimeout(() => { window.scrollBy(0, 1); window.scrollBy(0, -1); }, 120);   // iOS 26: Leistenfarbe neu lesen
  }
  let schliesseGross = function () {
    if (!gross.ov || !gross.ov.classList.contains('open')) return;
    gross.ov.classList.remove('open');
    if (document.documentElement.style.overflow === 'hidden') { document.documentElement.style.overflow = ''; return; }
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, gross.y || 0);
  }
  if (gross.ov) {
    gross.zu.addEventListener('click', () => schliesseGross());
    $('werkKarten').addEventListener('scroll', () => {
      const reihe = $('werkKarten'), k = reihe.firstElementChild;
      if (!k) return;
      const schritt = k.offsetWidth + parseFloat(getComputedStyle(reihe).columnGap || 0);
      const n = Math.round(reihe.scrollLeft / schritt);
      $('werkPunkte').querySelectorAll('.werk-punkt').forEach((b, i) => b.classList.toggle('aktiv', i === n));
    }, { passive: true });
    document.addEventListener('keydown', e => {
      if (!gross.ov.classList.contains('open')) return;
      if (e.key === 'Escape') schliesseGross();
      const r = $('werkKarten'), k = r.firstElementChild;
      if (!k || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      const schritt = k.offsetWidth + parseFloat(getComputedStyle(r).columnGap || 0);
      r.scrollBy({ left: e.key === 'ArrowRight' ? schritt : -schritt, behavior: 'smooth' });
    });
  }

  // Handy: über die Punkte wischen wie bei Instagram – der Punkt unter dem Finger wird gezeigt
  (function () {
    const punkte = $('werkPunkte'), reihe = $('werkKarten');
    if (!punkte || !reihe) return;
    let letzter = -1;
    function zeigeUnterFinger(x) {
      const btns = punkte.querySelectorAll('.werk-punkt');
      if (!btns.length) return;
      let best = 0, abstand = Infinity;
      btns.forEach((b, i) => {
        const r = b.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - x);
        if (d < abstand) { abstand = d; best = i; }
      });
      if (best === letzter) return;
      letzter = best;
      const karten = reihe.children;
      reihe.scrollTo({ left: karten[best].offsetLeft - karten[0].offsetLeft, behavior: 'smooth' });
      if (navigator.vibrate) navigator.vibrate(5);
    }
    punkte.addEventListener('touchstart', e => { letzter = -1; zeigeUnterFinger(e.touches[0].clientX); }, { passive: true });
    punkte.addEventListener('touchmove', e => { e.preventDefault(); zeigeUnterFinger(e.touches[0].clientX); }, { passive: false });
    punkte.addEventListener('touchend', () => { letzter = -1; });
  })();

  // Lupe auf den Fotos: Finger kurz halten -> das Foto vergrößert sich unter dem Finger, mit dem Finger herumwischen,
  // loslassen -> zurück. Solange die Lupe aktiv ist, blättern die Karten nicht weiter.
  (function () {
    const reihe = $('werkKarten');
    if (!reihe) return;
    const ZOOM = 2.5, WARTEN = 320, TOLERANZ = 10;
    let timer = null, start = null, bild = null, aktiv = false;
    function setzeUrsprung(t) {
      const r = bild.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, (t.clientX - r.left) / r.width * 100));
      const y = Math.max(0, Math.min(100, (t.clientY - r.top) / r.height * 100));
      bild.style.transformOrigin = x + '% ' + y + '%';
    }
    function ende() {
      clearTimeout(timer); timer = null;
      if (bild) { bild.style.transform = ''; bild.classList.remove('lupe'); }
      aktiv = false; bild = null; start = null;
    }
    reihe.addEventListener('touchstart', e => {
      const img = e.target.closest && e.target.closest('.werk-karte-foto');
      if (!img || e.touches.length > 1) return;
      bild = img;
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      timer = setTimeout(() => {
        aktiv = true;
        setzeUrsprung(e.touches[0]);
        bild.classList.add('lupe');
        bild.style.transform = 'scale(' + ZOOM + ')';
        if (navigator.vibrate) navigator.vibrate(8);
      }, WARTEN);
    }, { passive: true });
    reihe.addEventListener('touchmove', e => {
      if (!bild) return;
      const t = e.touches[0];
      if (!aktiv) {
        // vor dem Halten bewegt -> normales Wischen, keine Lupe
        if (Math.hypot(t.clientX - start.x, t.clientY - start.y) > TOLERANZ) ende();
        return;
      }
      e.preventDefault();          // Karten nicht weiterblättern, solange die Lupe aktiv ist
      setzeUrsprung(t);
    }, { passive: false });
    reihe.addEventListener('touchend', ende);
    reihe.addEventListener('touchcancel', ende);
    reihe.addEventListener('contextmenu', e => { if (e.target.closest && e.target.closest('.werk-karte-foto')) e.preventDefault(); });
  })();

  // Browser-Zurück schließt das offene Werk statt die Seite zu verlassen: beim Öffnen einen Verlaufseintrag anlegen,
  // "Zurück" (Taste, Wischgeste) löst popstate aus -> schließen. Wird per X/Pfeil/Klick geschlossen, den Eintrag wieder entfernen.
  let verlaufOffen = false, ausVerlauf = false;
  function merkeOffen() {
    if (verlaufOffen) return;
    history.pushState({ werkOffen: true }, '');
    verlaufOffen = true;
  }
  function vergissOffen() {
    if (!verlaufOffen) return;
    verlaufOffen = false;
    if (!ausVerlauf) history.back();   // eigenen Eintrag entfernen (löst popstate aus, dann ist aber nichts mehr offen)
  }
  window.addEventListener('popstate', () => {
    if (!verlaufOffen) return;
    ausVerlauf = true;
    verlaufOffen = false;
    if (gross.ov && gross.ov.classList.contains('open')) schliesseGross();
    if (aktuell) schliesse();
    ausVerlauf = false;
  });
  const _schliesse = schliesse, _schliesseGross = schliesseGross;
  schliesse = function () { const war = !!aktuell; _schliesse(); if (war) vergissOffen(); };
  schliesseGross = function () { const war = gross.ov && gross.ov.classList.contains('open'); _schliesseGross(); if (war) vergissOffen(); };

  document.querySelectorAll('.regal-produkt').forEach(btn => btn.addEventListener('click', () => { (handy.matches ? oeffneGross(btn) : oeffne(btn)); merkeOffen(); }));
  $('produktClose').addEventListener('click', schliesse);
  backdrop.addEventListener('click', schliesse);
  // "Mehr Fotos": am Computer öffnet sich die Galerie wie am Handy (Karten zum Blättern), am Handy bleibt Schritt 2
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

// ── Handy (wie Über uns): Logo-Button taucht beim Runterscrollen ab und kommt beim Hochscrollen wieder,
//    Zurück-Pfeil und "(Werke)" oben blenden genauso aus und ein ──
(function () {
  const btn = document.getElementById('ueberBurgerBtn');
  const mobil = window.matchMedia('(max-width: 768px)');
  let letzte = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY, d = y - letzte;
    if (!mobil.matches) { if (btn) btn.classList.remove('versteckt'); document.body.classList.remove('ecken-aus', 'wellen-weg'); letzte = y; return; }
    if (y < 40) { document.body.classList.remove('ecken-aus', 'wellen-weg'); if (btn) btn.classList.remove('versteckt'); letzte = y; return; }
    if (Math.abs(d) < 6) return;
    document.body.classList.toggle('ecken-aus', d > 0);
    document.body.classList.toggle('wellen-weg', d > 0);
    if (btn) btn.classList.toggle('versteckt', d > 0);
    letzte = y;
  }, { passive: true });
})();

// iOS-Safari zeigt :active (Tipp-Rückmeldung) nur, wenn irgendwo ein touchstart-Handler hängt
document.addEventListener('touchstart', function () {}, { passive: true });

// ── Lampe im Regal (Handy und Computer) wie auf Über uns – geht an, sobald sie im mittleren Teil des Bildschirms ist
//    (zwischen 20 % und 60 % der Höhe), sonst aus; Tippen/Klicken auf die Lampe schaltet um ──
(function () {
  const paare = [
    { schein: document.querySelector('.regal-wrap-mobil .werke-lampe-schein'), knopf: document.getElementById('werkeLampe') },
    { schein: document.querySelector('.werke-lampe-schein-desk'), knopf: document.querySelector('.werke-lampe-btn-desk') }
  ].filter(p => p.schein);
  if (!paare.length) return;
  paare.forEach(p => {
    p.an = false;
    p.setze = wert => { p.an = wert; p.schein.classList.toggle('an', wert); };
    if (p.knopf) p.knopf.addEventListener('click', () => p.setze(!p.an));
  });
  let geplant = false;
  function pruefe() {
    geplant = false;
    paare.forEach(p => {
      const r = (p.knopf || p.schein).getBoundingClientRect();
      if (!r.width && !r.height) return;                 // gerade ausgeblendet (anderes Gerät)
      const mitte = r.top + r.height / 2;
      // Computer: die Lampe steht ganz unten auf der Seite und kommt nie über 60 % -> dort bis 85 % der Höhe
      const unten = p.schein.classList.contains('werke-lampe-schein-desk') ? 0.85 : 0.6;
      p.setze(mitte > window.innerHeight * 0.2 && mitte < window.innerHeight * unten);
    });
  }
  function plane() { if (!geplant) { geplant = true; requestAnimationFrame(pruefe); } }
  window.addEventListener('scroll', plane, { passive: true });
  window.addEventListener('resize', plane, { passive: true });
  window.addEventListener('load', plane);
  plane();
})();
