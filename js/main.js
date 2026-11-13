// AD-Handwerk

// ── Layout-Berechnung ──
const MOBILE_MAX = 768;
const layout = { mobile: false, menuTop: 0, storyScroll: 0, w: 0, h: 0 };

function updateLayout() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const root = document.documentElement;
  const mobile = vw <= MOBILE_MAX;

  let terraTop, titleTop, beigeTop, textTop, pageHeight;

  if (mobile) {
    terraTop = vh * 0.89;
    titleTop = vh * 0.29;
    const menuTop = terraTop + vh * 0.12;
    // Die Menü-Grafik skaliert mit der Breite. Auf kurzen Bildschirmen (z. B. iPhone 8/SE) darf das Logo
    // deshalb nicht allein nach der Höhe positioniert werden, sonst rutscht es in "Workshops":
    // mindestens 20 px unter die Unterkante des letzten Menüpunkts.
    const textTopMin = menuTop + vw * 1.1635 + 55;
    textTop  = Math.max(menuTop + Math.min(vw * 1.432, vh * 0.74) + vh * 0.07, textTopMin);
    // Die Welle rückt bei Bedarf nach unten, damit der Text (ca. 175 px) noch auf dem Terracotta Platz hat
    beigeTop = Math.max(menuTop + vh * 1.11, textTop + 175);
    const storyTop = beigeTop + vh * 0.21;
    const sb = document.querySelector('.start-storyboard');
    pageHeight = storyTop + (sb ? sb.offsetHeight : 0) + vh * 0.10;

    layout.menuTop = menuTop;
    layout.storyScroll = beigeTop - vh * 0.12;
    root.style.setProperty('--menu-top',  menuTop  + 'px');
    root.style.setProperty('--story-top', storyTop + 'px');
    root.style.setProperty('--vh',        vh       + 'px');
  } else {
    terraTop = Math.min(vw * 0.65, vh * 0.86);
    titleTop = terraTop * 0.38;
    beigeTop = terraTop + vw * 0.65 - 20;
    textTop  = terraTop + vw * 0.48;
    pageHeight = beigeTop + vw * 0.58;
    // Geschichte (inkl. Sternchen-Text) muss ganz auf die Seite passen: top = beige-top + 16vw
    const sbd = document.querySelector('.start-storyboard');
    if (sbd) pageHeight = Math.max(pageHeight, beigeTop + vw * 0.16 + sbd.offsetHeight + vw * 0.12);
  }

  layout.mobile = mobile;
  layout.w = vw;
  layout.h = vh;

  root.style.setProperty('--terra-top',  terraTop  + 'px');
  root.style.setProperty('--title-top',  titleTop  + 'px');
  root.style.setProperty('--beige-top',  beigeTop  + 'px');
  root.style.setProperty('--text-top',   textTop   + 'px');

  document.getElementById('start').style.minHeight = pageHeight + 'px';
}

window.addEventListener('resize', () => {
  const small = window.innerWidth <= MOBILE_MAX;
  // Mobile Browser blenden beim Scrollen die Adressleiste ein/aus → Höhe ändert sich leicht, Layout soll nicht springen
  if (small && window.innerWidth === layout.w && Math.abs(window.innerHeight - layout.h) < 150) return;
  updateLayout();
});
updateLayout();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateLayout);
window.addEventListener('load', updateLayout);
// Seitenhöhe nachrechnen, sobald sich die Höhe der Geschichte ändert (Schrift lädt nach, Zeilenumbrüche, Drehen)
(function () {
  const sb = document.querySelector('.start-storyboard');
  if (sb && window.ResizeObserver) new ResizeObserver(() => updateLayout()).observe(sb);
})();

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
  // Am Handy: beim Scrollen schrumpft das Pop-up zu einem kleinen Kreis rechts über der Menüleiste.
  // Nur Tippen auf den kleinen Kreis öffnet es wieder (auch nicht beim Hochscrollen); das X legt es am Handy dort ab.
  const handy = window.matchMedia('(max-width: 768px)');
  let manuell = false, geoeffnetBei = 0, abgelegt = false;
  let schonfristBis = 0;   // kurz nach dem Erscheinen/Aufklappen zählt Scrollen nicht (sonst klappt es sofort wieder zu)
  function zeigen() {
    popup.classList.add('visible');
    manuell = true;
    geoeffnetBei = window.scrollY;
    schonfristBis = Date.now() + 2500;
  }
  // Maße: Skalierung des kleinen Kreises und Verschiebung vom Ziel-Platz (rechts unten) in die Bildschirmmitte.
  // Der kleine Kreis selbst hängt nur an right/bottom (CSS) und springt deshalb beim Scrollen nicht.
  let maßBreite = 0;
  function setzeMasse() {
    if (window.innerWidth === maßBreite) return;   // Höhenänderung durch die Safari-Leiste ignorieren
    maßBreite = window.innerWidth;
    const w = popup.offsetWidth || 340;
    popup.style.setProperty('--klein', (74 / w).toFixed(4));
    popup.style.setProperty('--odx', -(window.innerWidth / 2 - 52) + 'px');
    popup.style.setProperty('--ody', -(window.innerHeight / 2 - 67) + 'px');
  }
  setzeMasse();
  window.addEventListener('resize', setzeMasse);
  setTimeout(zeigen, 3000);
  function aufklappen() {
    popup.classList.remove('docked');
    abgelegt = false;
    manuell = true;
    geoeffnetBei = window.scrollY;
    schonfristBis = Date.now() + 2500;
  }
  popup.addEventListener('click', () => { if (handy.matches && popup.classList.contains('docked')) aufklappen(); });
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();   // sonst klappt der Klick-Handler des Pop-ups es sofort wieder auf
    if (handy.matches) { abgelegt = true; manuell = false; popup.classList.add('docked'); }   // am Handy: ablegen statt schließen
    else popup.classList.remove('visible', 'docked');
  });
  window.addEventListener('scroll', () => {
    if (!handy.matches || !popup.classList.contains('visible') || abgelegt) return;
    const y = window.scrollY;
    if (Date.now() < schonfristBis) { geoeffnetBei = y; return; }   // Schonfrist: Position mitführen, nicht ablegen
    if (manuell) {
      if (Math.abs(y - geoeffnetBei) > 16) { manuell = false; popup.classList.add('docked'); }
      return;
    }
    if (y > 12) popup.classList.add('docked');   // nur ablegen, nie von selbst wieder aufklappen
  }, { passive: true });

  function checkTerra() {
    let closeCenterY;
    if (handy.matches) {
      // Handy: Mitte des Pop-ups an seiner Zielposition (abgelegt: ca. 67 px über dem unteren Rand, offen: Bildschirmmitte)
      closeCenterY = popup.classList.contains('docked') ? window.innerHeight - 67 : window.innerHeight / 2;
    } else {
      const closeRect = closeBtn.getBoundingClientRect();
      closeCenterY = closeRect.top + closeRect.height / 2;
    }
    const terraTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--terra-top')) || 99999;
    const beigeTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--beige-top')) || 99999;
    const scrollY = window.scrollY;
    const onTerra = (scrollY + closeCenterY) >= terraTop && (scrollY + closeCenterY) <= beigeTop;
    popup.classList.toggle('on-terra', onTerra);
  }
  new MutationObserver(checkTerra).observe(popup, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('scroll', checkTerra, { passive: true });
  window.addEventListener('resize', checkTerra, { passive: true });
  setTimeout(checkTerra, 200);

})();

// ── Scroll-Pfeil ──
function scrollToMenu() {
  const terraTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--terra-top'));
  const top = layout.mobile ? layout.menuTop : terraTop + window.innerWidth * 0.07 - 10;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.getElementById('klickmich').closest('.home-klickmich-wrap').addEventListener('click', scrollToMenu);
document.querySelector('.scroll-arrow').addEventListener('click', scrollToMenu);

document.querySelector('.scroll-arrow-beige').addEventListener('click', () => {
  const beigeTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--beige-top'));
  const top = layout.mobile ? layout.storyScroll : beigeTop + window.innerWidth * 0.07 - 10;
  window.scrollTo({ top, behavior: 'smooth' });
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

document.querySelectorAll('.menu-item:not(.menu-item-page):not(.menu-item-aus)').forEach(item => {
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




// iOS-Safari zeigt :active (Tipp-Rückmeldung) nur, wenn irgendwo ein touchstart-Handler hängt
document.addEventListener('touchstart', function () {}, { passive: true });
