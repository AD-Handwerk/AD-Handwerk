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
function openOverlay(panel) {
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
  const x = panel === 'doris' ? window.innerWidth : 0;
  sliderWrap.scrollLeft = x;
  overlay.dataset.panel = panel === 'doris' ? 'doris' : 'fred';
}

function closeOverlay() {
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
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
function aktualisierePfeile() { overlay.dataset.panel = aktuellesPanel(); }
sliderWrap.addEventListener('scroll', aktualisierePfeile, { passive: true });
document.getElementById('personZuDoris').addEventListener('click', () => zeigePanel('doris'));
document.getElementById('personZuFred').addEventListener('click', () => zeigePanel('fred'));
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

document.getElementById('ueberBurgerBtn').addEventListener('click', openNav);
document.getElementById('ueberNavClose').addEventListener('click', closeNav);
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

// ── Logo-Button (Burger-Menü) auf dem Handy: erscheint erst beim ersten Runterscrollen hinter der Bodenwelle ──
(function () {
  const btn = document.getElementById('ueberBurgerBtn');
  if (!btn) return;
  const mobil = window.matchMedia('(max-width: 768px)');
  function pruefe() {
    if (!mobil.matches) { btn.classList.remove('sichtbar'); return; }
    if (window.scrollY > 8) btn.classList.add('sichtbar');   // einmal erschienen, bleibt es
  }
  window.addEventListener('scroll', pruefe, { passive: true });
  pruefe();
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
    hinweis.textContent = naeher() === 'doris' ? '< Zu Fred scrollen!' : 'Zu Doris scrollen! >';
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
    const von = dorisX();
    const weite = (dorisX() - fredX()) * 0.28;   // ein Stück Richtung Fred
    const dauer = 1400;
    const t0 = performance.now();
    top.style.scrollSnapType = 'none';
    function schritt(jetzt) {
      if (beruehrt) { top.style.scrollSnapType = ''; animiert = false; return; }
      const p = Math.min(1, (jetzt - t0) / dauer);
      // hin (0 -> 0.45) mit sanftem Ausklang, zurück (0.45 -> 1) mit kleinem Nachfedern
      let v;
      if (p < 0.45) { const q = p / 0.45; v = 1 - Math.pow(1 - q, 3); }
      else { const q = (p - 0.45) / 0.55; v = 1 - (1 - Math.pow(1 - q, 3)) + Math.sin(q * Math.PI * 2) * 0.04 * (1 - q); }
      top.scrollLeft = von - weite * v;
      if (p < 1) requestAnimationFrame(schritt);
      else { top.scrollLeft = von; top.style.scrollSnapType = ''; animiert = false; }
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
