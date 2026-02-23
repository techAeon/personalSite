(function () {

  /* ── Date ── */
  var DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var now = new Date();
  var dd  = now.getDate();
  var v   = dd % 100;
  var sfx = (v >= 11 && v <= 13) ? 'th' : dd % 10 === 1 ? 'st' : dd % 10 === 2 ? 'nd' : dd % 10 === 3 ? 'rd' : 'th';

  var THEME_URL = '';
  var datePart  = MONTHS[now.getMonth()] + ' ' + dd + sfx;
  var dateHTML  = THEME_URL ? '<a href="' + THEME_URL + '">' + datePart + '</a>' : datePart;

  var dateEl = document.getElementById('date-text');
  if (dateEl) {
    dateEl.innerHTML = '<span class="day-name">' + DAYS[now.getDay()] + '</span>, ' + dateHTML;
  }

  /* ── Theme toggle ── */
  var html     = document.documentElement;
  var btnTheme = document.getElementById('btn-theme');
  var iconSun  = document.getElementById('icon-sun');
  var iconMoon = document.getElementById('icon-moon');
  var iconHover = document.getElementById('icon-hover');

  var MODES = ['light', 'dark'];

  var NEXT_ICONS = {
    'light': '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    'dark':  '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
  };

  function applyTheme(mode) {
    html.setAttribute('data-theme', mode);
    var dark = mode === 'dark';
    iconSun.style.display  = dark ? 'none' : '';
    iconMoon.style.display = dark ? '' : 'none';
    if (iconHover && NEXT_ICONS[mode]) {
      iconHover.innerHTML = NEXT_ICONS[mode];
    }
    btnTheme.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    try { localStorage.setItem('kjo-theme', mode); } catch(e) {}
  }

  var saved = '';
  try { saved = localStorage.getItem('kjo-theme') || ''; } catch(e) {}
  applyTheme(saved === 'dark' ? 'dark' : 'light');

  btnTheme.addEventListener('click', function () {
    var current = html.getAttribute('data-theme') || 'light';
    var idx = MODES.indexOf(current);
    var next = MODES[(idx + 1) % MODES.length];
    applyTheme(next);
  });

  /* ── Accordion ── */
  var MOBILE_BP = 768;
  var accordion = document.getElementById('nav-accordion');
  var section   = document.getElementById('content-section');

  function allItems() { return Array.from(accordion.querySelectorAll('.nav-item')); }
  function isMobile() { return window.innerWidth <= MOBILE_BP; }

  function openItem(item) {
    item.classList.add('is-open');
    var s = item.querySelector('.nav-summary');
    if (s) s.setAttribute('aria-expanded', 'true');
  }

  function closeItem(item) {
    item.classList.remove('is-open');
    var s = item.querySelector('.nav-summary');
    if (s) s.setAttribute('aria-expanded', 'false');
  }

  function closeOthers(keep) {
    allItems().forEach(function(o) { if (o !== keep) closeItem(o); });
  }

  function lockHeight() {
    var list     = allItems();
    var snapshot = list.map(function(d) { return d.classList.contains('is-open'); });

    list.forEach(function(item) {
      item.querySelector('.nav-body').style.transition = 'none';
      item.querySelector('.nav-body-inner').style.transition = 'none';
    });

    var tallest = 0;
    list.forEach(function(item, i) {
      list.forEach(function(o, j) { if (j === i) openItem(o); else closeItem(o); });
      void section.offsetHeight;
      if (section.scrollHeight > tallest) tallest = section.scrollHeight;
    });

    list.forEach(function(item, i) { if (snapshot[i]) openItem(item); else closeItem(item); });
    void section.offsetHeight;

    list.forEach(function(item) {
      item.querySelector('.nav-body').style.transition = '';
      item.querySelector('.nav-body-inner').style.transition = '';
    });

    section.style.minHeight = tallest + 'px';
  }

  function applyDesktop(list) {
    list.forEach(function(item, i) { if (i === 0) openItem(item); else closeItem(item); });

    list.forEach(function(item) {
      var summary = item.querySelector('.nav-summary');

      summary.addEventListener('click', function(e) {
        if (e.target.closest('.nav-link')) return;
        if (item.classList.contains('is-open')) closeItem(item);
        else { closeOthers(item); openItem(item); }
      });

      summary.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); summary.click(); }
      });

      item.addEventListener('mouseenter', function() {
        if (!item.classList.contains('is-open')) { closeOthers(item); openItem(item); }
      });
    });
  }

  function applyMobile() { allItems().forEach(openItem); }

  if (isMobile()) {
    applyMobile();
  } else {
    lockHeight();
    applyDesktop(allItems());
  }

  var wasMobile = isMobile();
  window.addEventListener('resize', function() {
    var nowMobile = isMobile();
    if (nowMobile === wasMobile) return;
    wasMobile = nowMobile;

    var fresh = allItems().map(function(item) {
      var clone = item.cloneNode(true);
      item.parentNode.replaceChild(clone, item);
      return clone;
    });

    if (nowMobile) {
      fresh.forEach(openItem);
    } else {
      section.style.minHeight = '';
      lockHeight();
      applyDesktop(fresh);
    }
  });

})();
