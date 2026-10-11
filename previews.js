/* Shared, progressively enhanced publication previews. */
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const previews = [];
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        const preview = previews.find(item => item.container === entry.target);
        preview.visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        preview.sync();
      }
    }, { threshold: [0, 0.25] })
    : null;

  document.querySelectorAll('[data-preview]').forEach(container => {
    const video = container.querySelector('video');
    const button = container.querySelector('.preview-toggle');
    if (!video || !button) return;

    const state = {
      container, visible: false, userPaused: false, blocked: false,
      failed: false, pending: false,
      allowed() {
        return this.visible && !document.hidden && !motion.matches
          && !this.userPaused && !this.blocked && !this.failed;
      },
      updateButton() {
        button.hidden = motion.matches || this.failed || !observer;
        const action = video.paused ? 'Play' : 'Pause';
        button.textContent = action;
        button.setAttribute('aria-label', `${action} ${container.dataset.label} preview`);
      },
      async sync() {
        this.updateButton();
        if (!this.allowed()) {
          video.pause();
          if (motion.matches || this.failed || this.blocked) {
            container.classList.remove('has-frame');
          }
          return;
        }
        if (!video.paused || this.pending) return;
        if (!video.getAttribute('src')) video.src = video.dataset.src;
        this.pending = true;
        try {
          await video.play();
          // Playback may finish starting after a scroll or preference change.
          if (!this.allowed()) video.pause();
        } catch (error) {
          if (error.name !== 'AbortError') {
            this.blocked = true;
            container.classList.remove('has-frame');
          }
        } finally {
          this.pending = false;
          this.updateButton();
          // A rapid exit/re-entry can abort a pending play request.
          if (this.allowed() && video.paused) this.sync();
        }
      }
    };

    video.muted = true;
    video.addEventListener('playing', () => {
      if (state.allowed()) container.classList.add('has-frame');
      else video.pause();
      state.updateButton();
    });
    video.addEventListener('pause', () => state.updateButton());
    video.addEventListener('error', () => {
      state.failed = true;
      state.sync();
    });
    button.addEventListener('click', () => {
      if (motion.matches) return;
      if (!video.paused || state.pending) state.userPaused = true;
      else {
        state.userPaused = false;
        state.blocked = false;
      }
      state.sync();
    });
    previews.push(state);
    state.updateButton();
    observer?.observe(container);
  });

  const syncAll = () => previews.forEach(preview => preview.sync());
  document.addEventListener('visibilitychange', syncAll);
  motion.addEventListener('change', syncAll);
  window.addEventListener('pagehide', () => {
    previews.forEach(preview => preview.container.querySelector('video').pause());
  });
  window.addEventListener('pageshow', syncAll);
})();
