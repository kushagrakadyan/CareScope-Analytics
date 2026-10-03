/* CareScope UI stability layer */
document.addEventListener('DOMContentLoaded', () => {
  // Placeholder links (href="#") should never reload the page.
  document.querySelectorAll('a[href="#"]').forEach(a => {
    a.addEventListener('click', e => e.preventDefault());
  });
});
