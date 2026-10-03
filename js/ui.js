/* CareScope UI stability layer */
document.addEventListener('DOMContentLoaded', () => {
  // Never let placeholder links reload/steal focus.
  document.querySelectorAll('a[href="#"]').forEach(a => {
    a.addEventListener('click', e => e.preventDefault());
  });

  // Keep real navigation links reliable even when other scripts add listeners.
  document.querySelectorAll('.sidebar nav a[href$=".html"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href) window.location.assign(href);
    }, { capture: true });
  });

  // Make all modal layers explicit click targets and stop background handlers.
  document.addEventListener('click', e => {
    const modal = e.target.closest('.cs-modal');
    if (modal) e.stopPropagation();
  }, true);
});
