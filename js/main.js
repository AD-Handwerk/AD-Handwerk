// AD-Handwerk

// ── Layout-Berechnung ──
function updateLayout() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const terraTop = Math.min(vw * 0.65, vh * 0.86);
  const titleTop  = terraTop * 0.38;
  const beigeTop  = terraTop + vw * 0.65 - 20;
  const textTop   = terraTop + vw * 0.48;
  const pageHeight = beigeTop + vw * 0.58;

  const root = document.documentElement;
  root.style.setProperty('--terra-top',  terraTop  + 'px');
  root.style.setProperty('--title-top',  titleTop  + 'px');
  root.style.setProperty('--beige-top',  beigeTop  + 'px');
  root.style.setProperty('--text-top',   textTop   + 'px');

  document.getElementById('start').style.minHeight = pageHeight + 'px';
}

window.addEventListener('resize', updateLayout);
updateLayout();

// ── Intro entfernen nach Animation ──
const intro = document.getElementById('intro');
if (intro && intro.style.display !== 'none') {
  setTimeout(() => intro.remove(), 3800);
}

// ── Popup Blase ──
(function () {
  const popup = document.getElementById('homePopup');
  const closeBtn = document.getElementById('homePopupClose');
  if (!popup) return;
  setTimeout(() => popup.classList.add('visible'), 3000);
  closeBtn.addEventListener('click', () => popup.classList.remove('visible'));

  function checkTerra() {
    const closeRect = closeBtn.getBoundingClientRect();
    const closeCenterY = closeRect.top + closeRect.height / 2;
    const terraTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--terra-top')) || 99999;
    const beigeTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--beige-top')) || 99999;
    const scrollY = window.scrollY;
    const onTerra = (scrollY + closeCenterY) >= terraTop && (scrollY + closeCenterY) <= beigeTop;
    popup.classList.toggle('on-terra', onTerra);
  }
  window.addEventListener('scroll', checkTerra, { passive: true });
  window.addEventListener('resize', checkTerra, { passive: true });
  setTimeout(checkTerra, 200);

})();

// ── Scroll-Pfeil ──
document.getElementById('klickmich').closest('.home-klickmich-wrap').addEventListener('click', () => {
  const terraTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--terra-top'));
  window.scrollTo({ top: terraTop + window.innerWidth * 0.07 - 10, behavior: 'smooth' });
});

document.querySelector('.scroll-arrow').addEventListener('click', () => {
  const terraTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--terra-top'));
  window.scrollTo({ top: terraTop + window.innerWidth * 0.07 - 10, behavior: 'smooth' });
});

document.querySelector('.scroll-arrow-beige').addEventListener('click', () => {
  const beigeTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--beige-top'));
  window.scrollTo({ top: beigeTop + window.innerWidth * 0.07 - 10, behavior: 'smooth' });
});



// ── Impressum: nur am Seitenende ──
(function () {
  const imp = document.getElementById('impressum');
  function checkScroll() {
    const nearBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight < 400;
    if (nearBottom) {
      imp.classList.add('visible');
    } else {
      imp.classList.remove('visible');
      imp.classList.remove('open');
      imp.classList.remove('full');
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
  document.getElementById('impressum').classList.remove('open');
  document.getElementById('impressum').classList.remove('full');
});

document.getElementById('openImpressum').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('impressum').classList.add('full');
});

document.getElementById('impressumBack2').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('full');
});

document.getElementById('impressumClose2').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('open');
  document.getElementById('impressum').classList.remove('full');
});

document.getElementById('openRechtliches').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('impressum').classList.add('rechtliches');
});

document.getElementById('impressumBack3').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('rechtliches');
});

document.getElementById('impressumClose3').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('open');
  document.getElementById('impressum').classList.remove('rechtliches');
});

document.getElementById('openKontakt').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('impressum').classList.add('kontakt');
});

document.getElementById('impressumBack4').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('kontakt');
});

document.getElementById('impressumClose4').addEventListener('click', () => {
  document.getElementById('impressum').classList.remove('open');
  document.getElementById('impressum').classList.remove('kontakt');
});

// ── Impressum: Klick außerhalb schließt ──
document.addEventListener('click', (e) => {
  const imp = document.getElementById('impressum');
  if (imp.classList.contains('open') && !imp.contains(e.target)) {
    imp.classList.remove('open', 'full', 'kontakt', 'rechtliches');
  }
});

// ── 404 Overlay ──
const notFound = document.getElementById('not-found-overlay');
const notFoundWord = document.getElementById('notFoundWord');
const words = ['handwerk', 'error 404'];
let wordIndex = 0;
let wordInterval;

function startWordSwap() {
  wordInterval = setInterval(() => {
    notFoundWord.style.opacity = '0';
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      notFoundWord.textContent = words[wordIndex];
      notFoundWord.style.opacity = '1';
    }, 500);
  }, 3000);
}

document.querySelectorAll('.menu-item:not(.menu-item-page)').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    wordIndex = 0;
    notFoundWord.textContent = words[0];
    notFoundWord.style.opacity = '1';
    notFound.classList.add('visible');
    startWordSwap();
  });
});

document.getElementById('notFoundClose').addEventListener('click', () => {
  notFound.classList.remove('visible');
  clearInterval(wordInterval);
});

// ── Figuren-Animation (TODO: durch GIF ersetzen) ──


