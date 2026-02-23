(function () {

  var html = document.documentElement;

  var now  = new Date();
  var mm   = now.getMonth() + 1;
  var dd   = now.getDate();
  var mmdd = String(mm).padStart(2, '0') + '-' + String(dd).padStart(2, '0');

  var OCCASIONS = (typeof DAILY !== 'undefined' && DAILY.occasions) ? DAILY.occasions : [];

  var activeOccasion = null;
  for (var i = 0; i < OCCASIONS.length; i++) {
    var o = OCCASIONS[i];
    if (mmdd >= o.start && mmdd <= o.end) { activeOccasion = o; break; }
  }

  /* light → dark → occasion (if active) → back to light */
  var MODES = activeOccasion ? ['light', 'dark', 'occasion'] : ['light', 'dark'];

  var ICONS = {
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
    'dark':
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    'occasion':
      (activeOccasion && activeOccasion.icon)
        ? activeOccasion.icon
        : '<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>'
  };

  function applyMode(mode) {
    /* ── KEY RULE ──
       data-theme only ever gets 'light' or 'dark' — these are the only
       two values CSS knows about. 'occasion' is a logical mode that uses
       light as its CSS base but overrides the accent colour and adds a
       wallpaper background.
       We track the logical mode in localStorage separately.             */
    var isDark     = (mode === 'dark');
    var isOccasion = (mode === 'occasion');

    /* 1. CSS theme: light or dark */
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');

    /* 2. Accent colour */
    if (isOccasion && activeOccasion) {
      html.style.setProperty('--accent', activeOccasion.accent);
    } else if (isDark && activeOccasion) {
      html.style.setProperty('--accent', activeOccasion.accent_dark || activeOccasion.accent);
    } else {
      /* In normal light mode, always fall back to the default robin-blue accent from CSS. */
      html.style.removeProperty('--accent');
    }

    /* 3. Occasion wallpaper — only in occasion mode */
    if (isOccasion && activeOccasion) {
      html.setAttribute('data-occasion', activeOccasion.id);
    } else {
      html.removeAttribute('data-occasion');
    }

    /* 4. Button icons */
    var iconCur   = document.getElementById('icon-current');
    var iconHover = document.getElementById('icon-hover');
    var btnTheme  = document.getElementById('btn-theme');

    if (iconCur)  iconCur.innerHTML  = ICONS[mode]     || ICONS['light'];
    var nextMode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    if (iconHover) iconHover.innerHTML = ICONS[nextMode] || ICONS['light'];

    if (btnTheme) {
      btnTheme.title = 'Switch to ' + nextMode + ' mode';
      btnTheme.setAttribute('aria-label', 'Switch to ' + nextMode + ' mode');
    }

    /* 5. Store the LOGICAL mode (light/dark/occasion) not data-theme */
    try { localStorage.setItem('kjo-theme', mode); } catch(e) {}
  }

  /* ── On click: read logical mode from localStorage, not data-theme ── */
  function wireButton() {
    var btn = document.getElementById('btn-theme');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = '';
      try { current = localStorage.getItem('kjo-theme') || 'light'; } catch(e) { current = 'light'; }
      /* If saved mode is no longer valid (e.g. occasion ended), default to light */
      if (MODES.indexOf(current) === -1) current = 'light';
      var next = MODES[(MODES.indexOf(current) + 1) % MODES.length];
      applyMode(next);
    });
  }

  /* ── Initial load ── */
  var saved = '';
  try { saved = localStorage.getItem('kjo-theme') || ''; } catch(e) {}
  var initial = (MODES.indexOf(saved) !== -1) ? saved : 'light';
  applyMode(initial);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireButton);
  } else {
    wireButton();
  }

})();
