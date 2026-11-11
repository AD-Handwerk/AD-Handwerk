// Seitenübergang: Beim Klick auf einen Menüpunkt (a.menu-item-page) wird die Position
// gemerkt; die neue Seite startet damit ihren Blob-Übergang (siehe style.css, "SEITENÜBERGANG").
// Muss ohne defer im <head> stehen, damit der pagereveal-Listener rechtzeitig da ist.
(function () {
  const root = document.documentElement;

  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a.menu-item-page');
    if (!a) return;
    const r = a.getBoundingClientRect();
    try {
      sessionStorage.setItem('vtOrigin', JSON.stringify({ x: r.left + r.width / 2, y: r.top + r.height / 2, t: Date.now() }));
    } catch (_) {}
  }, true);

  window.addEventListener('pagereveal', e => {
    if (!e.viewTransition) return;
    let o = null;
    try {
      o = JSON.parse(sessionStorage.getItem('vtOrigin'));
      sessionStorage.removeItem('vtOrigin');
    } catch (_) {}
    if (!o || Date.now() - o.t > 5000) return;
    root.style.setProperty('--vt-x', o.x + 'px');
    root.style.setProperty('--vt-y', o.y + 'px');
    root.dataset.vt = 'blob';
    e.viewTransition.finished.finally(() => { delete root.dataset.vt; });
  });
})();
