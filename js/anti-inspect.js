/* Front-end deterrence only: cannot truly prevent inspection. */
(function () {
  'use strict';

  var warned = false;

  function blockContextMenu(e) {
    e.preventDefault();
  }

  function isBlockedShortcut(e) {
    var key = (e.key || '').toLowerCase();
    var code = e.keyCode || 0;

    if (code === 123 || key === 'f12') return true;

    var ctrlOrMeta = e.ctrlKey || e.metaKey;
    if (!ctrlOrMeta) return false;

    if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || key === 'k')) return true;
    if (key === 'u' || key === 's') return true;
    return false;
  }

  function blockShortcuts(e) {
    if (!isBlockedShortcut(e)) return;
    e.preventDefault();
    e.stopPropagation();
  }

  function detectDevtools() {
    var threshold = 180;
    var widthGap = window.outerWidth - window.innerWidth;
    var heightGap = window.outerHeight - window.innerHeight;
    var opened = widthGap > threshold || heightGap > threshold;

    if (opened && !warned) {
      warned = true;
      try {
        alert('Developer tools are disabled on this site.');
      } catch (err) {}
    }

    return opened;
  }

  function handleVisibility() {
    if (!detectDevtools()) return;
    var article = document.querySelector('#article-container') || document.querySelector('article');
    if (article) {
      article.innerHTML = '<p>Content unavailable.</p>';
    }
  }

  function bindGuards() {
    document.removeEventListener('contextmenu', blockContextMenu, true);
    document.removeEventListener('keydown', blockShortcuts, true);

    document.addEventListener('contextmenu', blockContextMenu, true);
    document.addEventListener('keydown', blockShortcuts, true);
  }

  bindGuards();
  setInterval(handleVisibility, 1000);
  document.addEventListener('pjax:complete', bindGuards);
})();
