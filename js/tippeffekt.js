// Tippeffekt für Touch-Geräte (Handy, Tablet): Beim Antippen von Zurück/Schließen zeigt der runde Hover-Kreis kurz
// seinen Bounce, bevor die Aktion ausgeführt wird. Ohne Verzögerung wäre er wegen des sofortigen Schließens unsichtbar.
// Mit Maus bleibt alles wie bisher (dort gibt es den normalen Hover).
(function () {
  const WAHL = '.impressum-close, .impressum-back, .person-close, .page-back-btn, .kalender-close, .kalender-back, .produkt-close, .produkt-zurueck, .impressum-nav a';
  const VERZOEGERUNG = 190;   // ms
  const tippbar = () => window.__tippErzwingen ||
    (window.matchMedia('(hover: none)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  document.addEventListener('click', e => {
    if (!tippbar()) return;
    const b = e.target.closest && e.target.closest(WAHL);
    if (!b || b.dataset.tippFertig === '1') return;
    e.preventDefault();
    e.stopImmediatePropagation();   // die eigentliche Aktion folgt nach der Verzögerung
    b.classList.add('tipp-aktiv');
    setTimeout(() => {
      b.classList.remove('tipp-aktiv');
      b.dataset.tippFertig = '1';
      b.click();
      delete b.dataset.tippFertig;
    }, VERZOEGERUNG);
  }, true);
})();
