// AD-Handwerk – Workshops

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Workshop-Monate hervorheben ──
function highlightWorkshopMonths(workshopItem) {
  // Alle alten Highlights entfernen
  document.querySelectorAll('.kalender-month').forEach(b => b.classList.remove('highlight'));

  if (!workshopItem) return;

  // Workshop in WORKSHOPS-Array finden anhand data-short
  const short = workshopItem.dataset.short;
  const ws = WORKSHOPS.find(w => w.short === short);
  if (!ws) return;

  // Monate mit freien Plätzen markieren
  Object.entries(ws.termine).forEach(([month, termine]) => {
    const hasSpots = termine.some(t => t.spots > 0);
    const btn = document.querySelector(`.kalender-month[data-month="${month}"]`);
    if (btn) btn.classList.toggle('highlight', hasSpots);
  });
}

document.querySelectorAll('.workshop-book-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const item = btn.closest('.workshop-item');
    highlightWorkshopMonths(item);
    const target = document.querySelector('#kalender');
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Book Button Scroll Animation ──
const bookObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      bookObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.workshop-book-btn').forEach(btn => bookObserver.observe(btn));

// ── Info-Box Hover ──
document.querySelectorAll('.workshop-info-btn').forEach(btn => {
  const item = btn.closest('.workshop-item');
  const box = item.querySelector('.workshop-info-box');
  const bookBtn = item.querySelector('.workshop-book-btn');
  btn.addEventListener('mouseenter', () => {
    box.style.width = bookBtn.offsetWidth + 'px';
    box.classList.add('visible');
  });
  btn.addEventListener('mouseleave', () => box.classList.remove('visible'));
});

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
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  window.addEventListener('resize', positionNavItems);
  window.addEventListener('load', positionNavItems);
})();

// ── Jahr Selector ──
(function () {
  const wrap = document.getElementById('kalenderYearWrap');
  const top = wrap.querySelector('.kalender-year-top');
  const numEl = wrap.querySelector('.kalender-year-num');

  const closeBtn = document.getElementById('kalenderYearClose');

  top.addEventListener('click', (e) => {
    e.stopPropagation();
    wrap.classList.toggle('open');
  });

  wrap.querySelectorAll('.kalender-year-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      numEl.textContent = item.dataset.year.slice(-2);
      wrap.classList.remove('open');
    });
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    wrap.classList.remove('open');
  });

  document.addEventListener('click', () => wrap.classList.remove('open'));
})();

// ── Workshop-Daten ──
const WORKSHOPS = [
  {
    id: 1, short: 'Töpfern für Einsteiger',
    termine: {
      '01': [{ datum: '03.01.2026', spots: 6 }, { datum: '24.01.2026', spots: 0 }],
      '03': [{ datum: '07.03.2026', spots: 4 }, { datum: '21.03.2026', spots: 2 }],
      '06': [{ datum: '06.06.2026', spots: 8 }],
      '09': [{ datum: '12.09.2026', spots: 2 }],
    }
  },
  {
    id: 2, short: 'Raku Brand mit Fred',
    termine: {
      '01': [{ datum: '03.01.2026', spots: 0 }, { datum: '24.01.2026', spots: 3 }],
      '02': [{ datum: '14.02.2026', spots: 5 }],
      '05': [{ datum: '09.05.2026', spots: 4 }],
      '08': [{ datum: '22.08.2026', spots: 1 }],
      '11': [{ datum: '14.11.2026', spots: 4 }],
    }
  },
  {
    id: 3, short: 'Tiere & Objekte aus Ton',
    termine: {
      '01': [{ datum: '17.01.2026', spots: 4 }],
      '04': [{ datum: '11.04.2026', spots: 7 }],
      '07': [{ datum: '04.07.2026', spots: 3 }],
      '10': [{ datum: '10.10.2026', spots: 6 }],
    }
  },
  {
    id: 4, short: 'Fliesen & Magnete',
    termine: {
      '03': [{ datum: '28.03.2026', spots: 8 }],
      '06': [{ datum: '20.06.2026', spots: 5 }],
      '09': [{ datum: '26.09.2026', spots: 4 }],
      '12': [{ datum: '05.12.2026', spots: 2 }],
    }
  },
  {
    id: 5, short: 'Offene Werkstattzeit',
    termine: {
      '02': [{ datum: '07.02.2026', spots: 2 }],
      '04': [{ datum: '25.04.2026', spots: 6 }],
      '07': [{ datum: '18.07.2026', spots: 5 }],
      '11': [{ datum: '28.11.2026', spots: 3 }],
    }
  },
];

// ── Overlay State ──
const overlay  = document.getElementById('monatOverlay');
const backdrop = document.getElementById('monatBackdrop');
let _selectedWorkshop = null;
let _selectedDatum    = null;

function showStep(n) {
  document.querySelectorAll('.monat-step').forEach((el, i) => el.hidden = (i + 1 !== n));
  overlay.classList.toggle('terracotta', n >= 3);
}

function setOriginFromBtn(btn) {
  const r = btn.getBoundingClientRect();
  const bx = r.left + r.width / 2;
  const by = r.top + r.height / 2;
  const size = Math.min(window.innerWidth * 0.7, window.innerHeight * 0.7);
  const ox = ((bx - window.innerWidth / 2 + size / 2) / size * 100).toFixed(1) + '%';
  const oy = ((by - window.innerHeight / 2 + size / 2) / size * 100).toFixed(1) + '%';
  overlay.style.transformOrigin = `${ox} ${oy}`;
}

function openOverlay(btn) {
  if (btn) setOriginFromBtn(btn);
  overlay.classList.remove('closing');
  overlay.classList.add('open');
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOverlay() {
  overlay.classList.remove('open');
  overlay.classList.add('closing');
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
  overlay.addEventListener('transitionend', () => {
    overlay.classList.remove('closing', 'terracotta');
  }, { once: true });
}

function buildPill(spots, label, onClick) {
  const li = document.createElement('li');
  li.className = 'monat-workshop-pill';
  const filled = spots > 0;
  li.innerHTML = `<span class="monat-pill-spots${filled ? '' : ' empty'}">${spots}</span><span class="monat-pill-name">${label}</span>`;
  li.addEventListener('click', onClick);
  return li;
}

// ── Monats-Knöpfe ──
const _measureEl = document.createElement('span');
_measureEl.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;font-family:AD-Unghia,sans-serif;font-size:clamp(16px,2vw,32px);white-space:nowrap';
document.body.appendChild(_measureEl);

document.querySelectorAll('.kalender-month').forEach(btn => {
  const label  = btn.querySelector('.kalender-month-label');
  const circle = btn.querySelector('.kalender-month-circle');
  const num    = label.textContent;
  const name   = btn.dataset.name;

  _measureEl.textContent = name;
  const targetSize = Math.max(_measureEl.offsetWidth + 40, 70) + 'px';

  let hoverTimer = null;

  btn.addEventListener('mouseenter', () => {
    label.style.visibility = 'hidden';
    circle.style.width  = targetSize;
    circle.style.height = targetSize;
    hoverTimer = setTimeout(() => {
      label.textContent = name;
      label.style.visibility = '';
      label.classList.remove('scale-in');
      void label.offsetWidth;
      label.classList.add('scale-in');
    }, 80);
  });

  btn.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    label.classList.remove('scale-in');
    label.style.visibility = '';
    label.textContent = num;
    circle.style.width  = '';
    circle.style.height = '';
  });

  btn.addEventListener('click', () => {
    highlightWorkshopMonths(null); // Highlights beim Öffnen des Overlays entfernen
    const month = btn.dataset.month;

    // Step 1: Workshops des Monats
    document.getElementById('monatHeading1').textContent = name;
    const list = document.getElementById('monatWorkshopList');
    list.innerHTML = '';
    let totalSpots = 0;

    WORKSHOPS.forEach(ws => {
      if (!ws.termine[month]) return;
      const spots = ws.termine[month].reduce((s, t) => s + t.spots, 0);
      totalSpots += spots;
      list.appendChild(buildPill(spots, ws.short, () => {
        _selectedWorkshop = ws;
        // Step 2: Termine des Workshops
        document.getElementById('monatHeading2').textContent = ws.short;
        const dateList = document.getElementById('monatDateList');
        dateList.innerHTML = '';
        ws.termine[month].forEach(t => {
          dateList.appendChild(buildPill(t.spots, t.datum, () => {
            _selectedDatum = t.datum;
            // Step 3: Bestätigung
            document.getElementById('monatHeading3').textContent = t.datum;
            document.getElementById('monatConfirmText').textContent =
              `Du möchtest am Workshop „${ws.short}" teilnehmen?`;
            showStep(3);
          }));
        });
        document.getElementById('monatSpots2').innerHTML = spots + ' Plätze<br>verfügbar';
        showStep(2);
      }));
    });

    document.getElementById('monatSpots').innerHTML = totalSpots + ' Plätze<br>verfügbar';
    showStep(1);
    openOverlay(btn);
  });
});

// ── Step 3 → 4 ──
document.getElementById('monatAnfragenBtn').addEventListener('click', () => showStep(4));

// ── Anzahl Stepper ──
let _anzahl = 0;
document.getElementById('monatPlus').addEventListener('click', () => {
  _anzahl++;
  document.getElementById('monatAnzahl').textContent = _anzahl;
});
document.getElementById('monatMinus').addEventListener('click', () => {
  if (_anzahl > 0) { _anzahl--; document.getElementById('monatAnzahl').textContent = _anzahl; }
});

// ── Formular Abschicken ──
document.getElementById('monatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  // Platzhalter — hier später mailto oder API
  alert('Anfrage abgeschickt! Wir melden uns bald.');
  closeOverlay();
});

// ── Overlay schließen ──
document.getElementById('monatClose').addEventListener('click', closeOverlay);
backdrop.addEventListener('click', closeOverlay);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay(); });

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

document.addEventListener('click', (e) => {
  const imp = document.getElementById('impressum');
  if (imp.classList.contains('open') && !imp.contains(e.target)) {
    imp.classList.remove('open', 'full', 'kontakt', 'rechtliches');
  }
});


