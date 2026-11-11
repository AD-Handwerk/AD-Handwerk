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
