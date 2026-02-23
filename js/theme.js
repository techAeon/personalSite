/**
 * theme.js
 * Include in your base layout BEFORE any other scripts.
 * Reads daily.json (inlined by Eleventy as window.DAILY),
 * applies occasion accent if today falls in a range,
 * and wires up the light/dark/occasion toggle button.
 *
 * Degrades gracefully: data-theme="light" on <html> in markup
 * means no-JS always gets light theme.
 *
 * In base.njk, before this script:
 *   <script>var DAILY = {{ daily | dump | safe }};</script>
 */
(function () {

  var html = document.documentElement;

  /* ── Helpers ── */
  var now  = new Date();
  var mm   = now.getMonth() + 1;
  var dd   = now.getDate();
  var mmdd = String(mm).padStart(2, '0') + '-' + String(dd).padStart(2, '0');

  /* ── Find active occasion ── */
  var OCCASIONS = (typeof DAILY !== 'undefined' && DAILY.occasions) ? DAILY.occasions : [];

  var activeOccasion = null;
  for (var i = 0; i < OCCASIONS.length; i++) {
    var o = OCCASIONS[i];
    if (mmdd >= o.start && mmdd <= o.end) { activeOccasion = o; break; }
  }

  /* ── Mode cycle ──
     On non-occasion days:  light → dark → light
     On occasion days:      light → dark → occasion → light
  ── */
  var MODES = activeOccasion ? ['light', 'dark', 'occasion'] : ['light', 'dark'];

  /* ── SVG icon markup per mode ──
     Each entry is the inner SVG path/shape markup only.
     The hover icon shows what you'll switch TO next.     */
  var ICONS = {
    /* Sun — shown when current mode is light */
    'light':
      '<circle cx="12" cy="12" r="5"/>' +
      '<line x1="12" y1="1" x2="12" y2="3"/>' +
      '<line x1="12" y1="21" x2="12" y2="23"/>' +
      '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>' +
      '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
      '<line x1="1" y1="12" x2="3" y2="12"/>' +
      '<line x1="21" y1="12" x2="23" y2="12"/>' +
      '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>' +
      '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',

    /* Moon — shown when current mode is dark */
    'dark':
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',

    /* Occasion icon — injected from daily.json, fallback to sparkle */
    'occasion':
      (activeOccasion && activeOccasion.icon)
        ? activeOccasion.icon
        : '<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>'
  };

  /* ── Apply a theme mode ── */
  function applyMode(mode) {
    html.setAttribute('data-theme', mode);

    var isDark     = (mode === 'dark');
    var isOccasion = (mode === 'occasion');

    /* Set accent colour */
    if (isOccasion && activeOccasion) {
      html.style.setProperty('--accent', activeOccasion.accent);
    } else if (isDark && activeOccasion && activeOccasion.accent_dark) {
      /* Occasion dark variant when in dark mode but not occasion mode */
      html.style.setProperty('--accent', activeOccasion.accent_dark);
    } else if (activeOccasion && !isDark) {
      html.style.setProperty('--accent', activeOccasion.accent);
    } else {
      /* No occasion — clear any override, CSS var default takes over */
      html.style.removeProperty('--accent');
    }

    /* Update button icons */
    var btnTheme  = document.getElementById('btn-theme');
    var iconCur   = document.getElementById('icon-current');
    var iconHover = document.getElementById('icon-hover');

    if (iconCur)  iconCur.innerHTML  = ICONS[mode] || ICONS['light'];

    var nextMode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    if (iconHover) iconHover.innerHTML = ICONS[nextMode] || ICONS['light'];

    if (btnTheme) {
      btnTheme.title = 'Switch to ' + nextMode + ' mode';
      btnTheme.setAttribute('aria-label', 'Switch to ' + nextMode + ' mode');
    }

    try { localStorage.setItem('kjo-theme', mode); } catch(e) {}
  }

  /* ── Load saved preference, validate it's still in current MODES ── */
  var saved = '';
  try { saved = localStorage.getItem('kjo-theme') || ''; } catch(e) {}
  var initial = (MODES.indexOf(saved) !== -1) ? saved : 'light';
  applyMode(initial);

  /* ── Wire up toggle button ── */
  /* Use DOMContentLoaded in case theme.js loads in <head> */
  function wireButton() {
    var btn = document.getElementById('btn-theme');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = html.getAttribute('data-theme') || 'light';
      var idx     = MODES.indexOf(current);
      var next    = MODES[(idx + 1) % MODES.length];
      applyMode(next);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireButton);
  } else {
    wireButton();
  }

})();
