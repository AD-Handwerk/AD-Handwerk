// AD-Handwerk – Über Uns

// ── Smooth Scroll ──
document.querySelector('.ueber-mehr-scroll').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('ueber-content').scrollIntoView({ behavior: 'smooth' });
});

// ── Person Overlay ──
const overlay = document.getElementById('person-overlay');
const sliderWrap = document.getElementById('personSliderWrap');
const scrollHint = document.getElementById('personScrollHint');
// Scrollen im Fred/Doris-Fenster komplett sperren (iOS ignoriert overflow:hidden): Seite festsetzen, Wischen und Mausrad abfangen
let personScrollY = 0;
function sperreScrollen() {
  personScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + personScrollY + 'px';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
}
function gibScrollenFrei() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, personScrollY);
}
overlay.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

function openOverlay(panel) {
  overlay.classList.add('visible');
  if (document.body.style.position !== 'fixed') sperreScrollen();
  const x = panel === 'doris' ? window.innerWidth : 0;
  sliderWrap.scrollLeft = x;
  overlay.dataset.panel = panel === 'doris' ? 'doris' : 'fred';
  setzeStreifen(overlay.dataset.panel);
}

// iOS 26 Safari übernimmt die Leistenfarbe erst bei einer Scroll-Bewegung neu: nach dem Schließen 1 px anstupsen
function leistenNeuBerechnen() {
  setTimeout(() => { window.scrollBy(0, 1); window.scrollBy(0, -1); }, 650);
}

function closeOverlay() {
  if (/[?&]p=/.test(window.location.search) && window.history && history.replaceState) history.replaceState(null, '', 'ueber-uns.html');
  setzeSeitenfarbe(null);
  overlay.classList.remove('visible');
  gibScrollenFrei();
  leistenNeuBerechnen();
}

document.getElementById('openAlfred').addEventListener('click', (e) => {
  e.preventDefault();
  openOverlay('fred');
});

document.getElementById('openAlfredMobil').addEventListener('click', (e) => {
  e.preventDefault();
  openOverlay('fred');
});

document.getElementById('openDoris').addEventListener('click', (e) => {
  e.preventDefault();
  openOverlay('doris');
});

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', closeOverlay);
});

// Scrollen → Panel wechseln (nur wenn Overlay offen).
// Jede Scroll-Geste (rauf, runter, links, rechts) springt zum jeweils anderen Panel,
// damit man von Doris auch wieder zu Fred kommt. Das Nachlaufen des Trackpads
// (Trägheit) zählt nicht als neue Geste, sonst würde es hin- und herspringen.
let lastWheel = 0;
let wheelLockedUntil = 0;
let gesteErledigt = false;   // diese Geste hat schon gewechselt
let gesteSumme = 0;          // aufsummierte Scroll-Strecke der aktuellen Geste
function aktuellesPanel() {
  return sliderWrap.scrollLeft > window.innerWidth / 2 ? 'doris' : 'fred';
}
function zeigePanel(panel) {
  sliderWrap.scrollTo({ left: panel === 'doris' ? window.innerWidth : 0, behavior: 'smooth' });
}
// Pfeil neben dem X zeigt immer zum anderen Panel (Fred: rechts, Doris: links)
// Streifen ganz oben im Overlay in der Farbe des sichtbaren Fensters. Bei jedem Wechsel wird ein neues Element eingesetzt und das
// alte entfernt, dazu 1 px Scroll-Stups: so liest iOS 26 Safari die Farbe der oberen Leiste jedes Mal neu.
let leistenTimer = null;
const LEISTEN_FARBE = { fred: '#8C9E82', doris: '#BEA49C' };
const handyFarben = () => window.matchMedia('(max-width: 768px)').matches;
function setzeSeitenfarbe(farbe) {
  // zusätzlich zum Streifen: Seitenhintergrund und theme-color in der Farbe des Fensters (oder wieder zurück auf den Normalzustand)
  const html = document.documentElement;
  if (farbe) { html.style.setProperty('background', farbe, 'important'); document.body.style.setProperty('background', farbe, 'important'); }
  else { html.style.removeProperty('background'); document.body.style.removeProperty('background'); }
  let m = document.querySelector('meta[name="theme-color"]');
  if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); }
  m.content = farbe || '#F3D9D4';
}
function setzeStreifen(wer) {
  setzeSeitenfarbe(LEISTEN_FARBE[wer]);
  overlay.querySelectorAll('.leisten-streifen').forEach((e) => e.remove());
  const s = document.createElement('div');
  s.className = 'leisten-streifen ' + wer;
  s.setAttribute('aria-hidden', 'true');
  overlay.appendChild(s);
  clearTimeout(leistenTimer);
  leistenTimer = setTimeout(() => {
    const alt = document.body.style.overflow;
    document.body.style.overflow = '';
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
    document.body.style.overflow = alt;
  }, 150);
}
function aktualisierePfeile() {
  const neu = aktuellesPanel();
  if (overlay.dataset.panel === neu) return;
  overlay.dataset.panel = neu;
  setzeStreifen(neu);
}
sliderWrap.addEventListener('scroll', aktualisierePfeile, { passive: true });
// Handy: der Wechsel lädt die Seite neu und öffnet gleich das andere Fenster (Safari liest dabei die Leistenfarbe neu).
// Computer: weiches Wischen wie bisher.
function wechsleZu(wer) {
  if (handyFarben()) { window.location.href = 'ueber-uns.html?p=' + wer; }
  else zeigePanel(wer);
}
document.getElementById('personZuDoris').addEventListener('click', () => wechsleZu('doris'));
document.getElementById('personZuFred').addEventListener('click', () => wechsleZu('fred'));

// Beim Laden mit ?p=fred|doris (nur Handy): das Fenster sofort ohne Einblenden öffnen
(function () {
  const m = /[?&]p=(fred|doris)/.exec(window.location.search);
  if (!m || !handyFarben()) return;
  overlay.style.transition = 'none';
  openOverlay(m[1]);
  requestAnimationFrame(() => { overlay.style.transition = ''; });
})();
document.addEventListener('wheel', (e) => {
  if (!overlay.classList.contains('visible')) return;
  e.preventDefault();
  const now = Date.now();
  if (now - lastWheel > 160) { gesteErledigt = false; gesteSumme = 0; }   // Pause = neue Geste
  lastWheel = now;
  if (gesteErledigt || now < wheelLockedUntil) return;
  // Ein Trackpad-Wisch beginnt mit winzigen Werten, deshalb summieren statt Einzelwert prüfen
  gesteSumme += Math.abs(e.deltaY) + Math.abs(e.deltaX);
  if (gesteSumme < 24) return;
  gesteErledigt = true;
  wheelLockedUntil = now + 700;
  zeigePanel(aktuellesPanel() === 'doris' ? 'fred' : 'doris');
}, { passive: false });

// Pfeiltasten wechseln das Panel, Escape schließt
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeOverlay();
  if (!overlay.classList.contains('visible')) return;
  if (e.key === 'ArrowLeft')  zeigePanel('fred');
  if (e.key === 'ArrowRight') zeigePanel('doris');
});


// ── Nav: Menüpunkte an SVG-Punkte ausrichten ──
function positionNavItems() {
  const overlay = document.getElementById('ueber-nav-overlay');
  const svg = document.querySelector('.ueber-nav-grafik');
  if (!overlay || !svg) return;
  const oRect = overlay.getBoundingClientRect();
  const sRect = svg.getBoundingClientRect();
  document.querySelectorAll('.ueber-nav-item[data-dot-x], .ueber-nav-btns[data-dot-x]').forEach(item => {
    const dotX = parseFloat(item.dataset.dotX);
    const left = (sRect.left - oRect.left) + dotX * sRect.width;
    item.style.left = left + 'px';
  });
}
window.addEventListener('resize', positionNavItems);
window.addEventListener('load', positionNavItems);

// ── Burger Menü ──
const navOverlay  = document.getElementById('ueber-nav-overlay');
const navBackdrop = document.getElementById('ueberNavBackdrop');

const mobilMenue = document.getElementById('ueberMobilMenue');
let menueScrollY = 0;
if (mobilMenue) mobilMenue.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
if (mobilMenue) mobilMenue.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
const handyMenue = () => window.matchMedia('(max-width: 768px)').matches && mobilMenue;

function openNav() {
  if (handyMenue()) {
    mobilMenue.classList.add('open');
    mobilMenue.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menue-offen');
    // Scrollen komplett sperren (iOS ignoriert overflow:hidden): Seite festsetzen und Wischen im Menü abfangen
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
    leistenNeuBerechnen();
    return;
  }
  navOverlay.classList.remove('open');
  navBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  leistenNeuBerechnen();
}

document.getElementById('ueberBurgerBtn').addEventListener('click', openNav);
document.getElementById('ueberNavClose').addEventListener('click', closeNav);
if (document.getElementById('mmZu')) document.getElementById('mmZu').addEventListener('click', closeNav);
if (document.getElementById('mmX')) document.getElementById('mmX').addEventListener('click', closeNav);
if (mobilMenue) mobilMenue.querySelector('.mi-ueber').addEventListener('click', (e) => { e.preventDefault(); closeNav(); });
navBackdrop.addEventListener('click', closeNav);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

// ── Lampen Gimmick ──
document.getElementById('lampeToggle').addEventListener('mouseenter', () => {
  document.body.classList.add('lights-out');
});
document.getElementById('lampeToggle').addEventListener('mouseleave', () => {
  document.body.classList.remove('lights-out');
});

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

// ── Hinweis auf dem Handy: Seite ist noch nicht für mobile Geräte angepasst ──
(function () {
  // Auf true stellen, um den Hinweis wieder anzuzeigen (die Seite ist inzwischen für Handys angepasst)
  const HINWEIS_AKTIV = false;
  const box = document.getElementById('mobilHinweis');
  if (!HINWEIS_AKTIV || !box || !window.matchMedia('(max-width: 768px)').matches) return;
  const weiter = document.getElementById('mobilHinweisWeiter');
  function schliessen() {
    box.hidden = true;
    document.body.style.overflow = '';
  }
  box.hidden = false;
  document.body.style.overflow = 'hidden';
  weiter.addEventListener('click', schliessen);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) schliessen(); });
  weiter.focus({ preventScroll: true });
})();

// ── Logo-Button (Burger-Menü) auf dem Handy: anfangs da, beim Runterscrollen verschwindet er, beim Hochscrollen kommt er wieder ──
(function () {
  const btn = document.getElementById('ueberBurgerBtn');
  if (!btn) return;
  const mobil = window.matchMedia('(max-width: 768px)');
  let letzte = window.scrollY;
  window.addEventListener('scroll', () => {
    if (!mobil.matches) { btn.classList.remove('versteckt'); letzte = window.scrollY; return; }
    const y = window.scrollY, d = y - letzte;
    if (Math.abs(d) < 6) return;                       // kleine Wackler ignorieren
    if (d > 0 && y > 160) btn.classList.add('versteckt');   // nach unten, nicht ganz oben
    else btn.classList.remove('versteckt');                 // nach oben oder am Seitenanfang
    letzte = y;
  }, { passive: true });
})();

// ── Handy: Hero zum seitlichen Wischen (Doris <-> Fred) ──
(function () {
  const top = document.getElementById('ueber-top');
  const hinweis = document.getElementById('ueberWischHinweis');
  if (!top || !hinweis) return;
  const mobil = window.matchMedia('(max-width: 768px)');
  const hw = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hw')) || 2.9;
  const dorisX = () => top.clientWidth * Math.max(hw() * 0.76 - 0.544, hw() * 0.56 + 0.03);   // Alfred bleibt aus dem Bild
  const fredX = () => top.clientWidth * (hw() * 0.425 - 0.5);
  const naeher = () => (top.scrollLeft > (dorisX() + fredX()) / 2 ? 'doris' : 'fred');
  function zeigeHinweis() {
    hinweis.textContent = naeher() === 'doris' ? 'Wischen, um zu Fred zu kommen' : 'Wischen, um zu Doris zu kommen';
  }
  function start() {
    if (!mobil.matches) return;
    top.style.scrollBehavior = 'auto';
    top.scrollLeft = dorisX();
    zeigeHinweis();
  }
  start();
  window.addEventListener('load', start);
  window.addEventListener('ueberHeroMasse', start);
  top.addEventListener('scroll', zeigeHinweis, { passive: true });
  hinweis.addEventListener('click', () => {
    top.scrollTo({ left: naeher() === 'doris' ? fredX() : dorisX(), behavior: 'smooth' });
  });

  // Hinweis-Bewegung: Nach einer Weile schiebt sich der Hero von selbst ein Stück zu Fred und federt zurück,
  // damit man versteht, dass man seitlich weiterwischen kann. Sobald jemand den Hero berührt, hört das auf.
  let beruehrt = false;
  let animiert = false;
  ['touchstart', 'mousedown', 'wheel'].forEach((n) => top.addEventListener(n, () => { beruehrt = true; }, { passive: true }));
  hinweis.addEventListener('click', () => { beruehrt = true; });
  function wackeln() {
    if (beruehrt || animiert || !mobil.matches || window.scrollY > 4) return;
    if (naeher() !== 'doris') return;
    animiert = true;
    hinweis.classList.add('zeigen');   // Text blendet zusammen mit der Bewegung ein
    const von = dorisX();
    const weite = (dorisX() - fredX()) * 0.28;   // ein Stück Richtung Fred
    const dauer = 1400;
    const t0 = performance.now();
    top.style.scrollSnapType = 'none';
    function schritt(jetzt) {
      if (beruehrt) { top.style.scrollSnapType = ''; animiert = false; hinweis.classList.remove('zeigen'); return; }
      const p = Math.min(1, (jetzt - t0) / dauer);
      // hin (0 -> 0.45) mit sanftem Ausklang, zurück (0.45 -> 1) mit kleinem Nachfedern
      let v;
      if (p < 0.45) { const q = p / 0.45; v = 1 - Math.pow(1 - q, 3); }
      else { const q = (p - 0.45) / 0.55; v = 1 - (1 - Math.pow(1 - q, 3)) + Math.sin(q * Math.PI * 2) * 0.04 * (1 - q); }
      top.scrollLeft = von - weite * v;
      if (p < 1) requestAnimationFrame(schritt);
      else { top.scrollLeft = von; top.style.scrollSnapType = ''; animiert = false; setTimeout(() => hinweis.classList.remove('zeigen'), 400); }
    }
    requestAnimationFrame(schritt);
  }
  setTimeout(wackeln, 2800);
  setTimeout(wackeln, 9000);
})();

// ── Handy: Der erste Abschnitt füllt den ganzen Bildschirm ──
// Foto und Text darunter sollen erst beim Runterscrollen sichtbar werden. Die Illustration (samt Welle, Alfred, Doris)
// rutscht dafür so weit nach unten, dass "Du willst mehr über uns lesen?" etwas über dem unteren Rand sitzt, und
// die Beige-Zone darunter füllt den Rest, sodass "#ueber-content" genau am unteren Bildschirmrand beginnt.
(function () {
  const zone = document.querySelector('.ueber-mehr-zone');
  const prompt = document.getElementById('ueberWischHinweis');
  if (!zone || !prompt) return;
  const root = document.documentElement;
  const mobil = window.matchMedia('(max-width: 768px)');
  let letzteBreite = 0;
  function anpassen(force) {
    if (!force && window.innerWidth === letzteBreite) return;   // Höhenänderung durch die Safari-Leiste ignorieren
    letzteBreite = window.innerWidth;
    zone.style.minHeight = '';
    root.style.removeProperty('--hero-extra');
    root.style.removeProperty('--hw');
    if (!mobil.matches) return;
    // Die weiße Welle sitzt bei einem festen Anteil der Bildschirmhöhe: der Hinweis darunter steht dann ca. 75 px über dem (darunter liegt die feste Bodenwelle)
    // unteren Rand. Die Illustration wird dafür in der Breite angepasst (kurze Handys: kleiner, hohe: größer, 210 bis 260 %), der Rest
    // wird als Luft über der Illustration verteilt.
    const w = window.innerWidth;
    const welleY = window.innerHeight - 145;
    const luftMin = w * 0.12;
    let hwNeu = (welleY - 64 - luftMin) / (0.357 * w);
    hwNeu = Math.max(2.1, Math.min(2.6, hwNeu));
    const extra = Math.max(0, welleY - 64 - hwNeu * 0.357 * w);
    root.style.setProperty('--hw', hwNeu.toFixed(3));
    root.style.setProperty('--hero-extra', extra + 'px');
    const oben = zone.getBoundingClientRect().top + window.scrollY;
    zone.style.minHeight = Math.max(0, window.innerHeight - oben) + 'px';
    window.dispatchEvent(new Event('ueberHeroMasse'));
  }
  anpassen(true);
  window.addEventListener('load', () => anpassen(true));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => anpassen(true));
  window.addEventListener('resize', () => anpassen(false));
})();

// ── Handy: Lampe geht an, sobald der Bilderrahmen im Bild ist, und wieder aus, wenn man wegscrollt ──
(function () {
  const schein = document.querySelector('.lampen-schein');
  const rahmen = document.querySelector('.ueber-rahmen-wrap');
  const knopf = document.getElementById('lampeToggle');
  if (!schein || !rahmen) return;
  const mobil = window.matchMedia('(max-width: 768px)');
  let an = false;
  function setze(wert) {
    an = wert;
    schein.classList.toggle('an', an);
  }
  // an, wenn die Mitte des Bilderrahmens im mittleren Teil des Bildschirms liegt (zwischen 20 % und 85 % der Höhe)
  let geplant = false;
  function pruefe() {
    geplant = false;
    if (!mobil.matches) return;
    const r = rahmen.getBoundingClientRect();
    const mitte = r.top + r.height / 2;
    setze(mitte > window.innerHeight * 0.2 && mitte < window.innerHeight * 0.85);
  }
  function plane() { if (!geplant) { geplant = true; requestAnimationFrame(pruefe); } }
  window.addEventListener('scroll', plane, { passive: true });
  window.addEventListener('resize', plane, { passive: true });
  window.addEventListener('load', plane);
  plane();
  // Tippen auf die Lampe schaltet um (Hover gibt es am Handy nicht)
  if (knopf) knopf.addEventListener('click', () => { if (mobil.matches) setze(!an); });
})();

// ── Foto-Pop-up: Tipp auf das Foto im Bilderrahmen öffnet einen Terracotta-Vollbild mit dem Foto im Blob; X / Escape schließt ──
(function () {
  const foto = document.getElementById('ueberFoto');
  const overlay = document.getElementById('fotoOverlay');
  const zu = document.getElementById('fotoClose');
  if (!foto || !overlay || !zu) return;
  let offen = false;
  function oeffne() {
    if (offen) return;
    offen = true;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';   // wie beim Fred/Doris-Overlay
    zu.focus({ preventScroll: true });
    // iOS 26 Safari übernimmt die Leistenfarbe erst bei einer Scroll-Bewegung: einmal 1 px anstupsen
    setTimeout(() => { window.scrollBy(0, 1); window.scrollBy(0, -1); }, 120);
  }
  function schliesse() {
    if (!offen) return;
    offen = false;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    foto.focus({ preventScroll: true });
    if (typeof leistenNeuBerechnen === 'function') leistenNeuBerechnen();
  }
  foto.addEventListener('click', oeffne);
  foto.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); oeffne(); } });
  zu.addEventListener('click', schliesse);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') schliesse(); });
})();

// ── Handy: Zurück-Pfeil und "(Über Uns)" oben blenden beim Runterscrollen aus, beim Hochscrollen und ganz oben wieder ein ──
(function () {
  const mobil = window.matchMedia('(max-width: 768px)');
  let letzte = window.scrollY;
  window.addEventListener('scroll', () => {
    if (!mobil.matches) { document.body.classList.remove('ecken-aus'); letzte = window.scrollY; return; }
    const y = window.scrollY, d = y - letzte;
    if (y < 40) { document.body.classList.remove('ecken-aus'); letzte = y; return; }
    if (Math.abs(d) < 6) return;                       // kleine Wackler ignorieren
    document.body.classList.toggle('ecken-aus', d > 0); // nach unten aus, nach oben ein
    letzte = y;
  }, { passive: true });
})();


// iOS-Safari zeigt :active (Tipp-Rückmeldung) nur, wenn irgendwo ein touchstart-Handler hängt
document.addEventListener('touchstart', function () {}, { passive: true });
