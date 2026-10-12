/* Decorative light pauses while hidden, focused, or motion is reduced. */
(() => {
  if (!('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-flow-cover]').forEach(cover => {
    let visible = false;
    let pageHidden = false;
    const sync = () => {
      const running = visible && !document.hidden && !pageHidden && !motion.matches
        && !cover.matches(':hover') && !cover.contains(document.activeElement);
      cover.classList.toggle('is-flowing', running);
      cover.dataset.flowState = running ? 'running' : 'paused';
    };
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      sync();
    }, { threshold: [0, 0.25] });
    observer.observe(cover);
    cover.addEventListener('mouseenter', sync);
    cover.addEventListener('mouseleave', sync);
    cover.addEventListener('focus', sync);
    cover.addEventListener('blur', sync);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    window.addEventListener('pagehide', () => { pageHidden = true; sync(); });
    window.addEventListener('pageshow', () => { pageHidden = false; sync(); });
    sync();
  });
})();
