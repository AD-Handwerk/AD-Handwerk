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
}

function closeOverlay() {
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

document.getElementById('openAlfred').addEventListener('click', (e) => {
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

// Scrollen → Panel wechseln (nur wenn Overlay offen)
let scrollLocked = false;
document.addEventListener('wheel', (e) => {
  if (!overlay.classList.contains('visible')) return;
  e.preventDefault();
  if (scrollLocked) return;
  const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  if (Math.abs(delta) < 10) return;
  scrollLocked = true;
  const target = delta > 0 ? window.innerWidth : 0;
  sliderWrap.scrollTo({ left: target, behavior: 'smooth' });
  setTimeout(() => { scrollLocked = false; }, 800);
}, { passive: false });

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeOverlay();
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

// ── Impressum: scroll detection ──
(function () {
  const imp = document.getElementById('impressum');

  function checkScroll() {
    const nearBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight < 400;
    if (nearBottom) {
      imp.classList.add('visible');
    } else {
      imp.classList.remove('visible', 'open', 'full');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
})();

// ── Impressum Toggle ──
document.getElementById('impressumToggle').addEventListener('click', () => {
  document.getElementById('impressum').classList.toggle('open');
});

document.getElementById('impressumClose').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('open', 'full', 'kontakt', 'rechtliches');
});

document.getElementById('openImpressum').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('impressum').classList.add('full');
});

document.getElementById('impressumBack2').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('full');
});

document.getElementById('impressumClose2').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('open', 'full');
});

document.getElementById('openRechtliches').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('impressum').classList.add('rechtliches');
});

document.getElementById('impressumBack3').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('rechtliches');
});

document.getElementById('impressumClose3').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('open', 'rechtliches');
});

document.getElementById('openKontakt').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('impressum').classList.add('kontakt');
});

document.getElementById('impressumBack4').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('kontakt');
});

document.getElementById('impressumClose4').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('open', 'kontakt');
});

// Click outside impressum closes it
document.addEventListener('click', (e) => {
  const imp = document.getElementById('impressum');
  if (imp.classList.contains('open') && !imp.contains(e.target)) {
    imp.classList.remove('open', 'full', 'kontakt', 'rechtliches');
  }
});
