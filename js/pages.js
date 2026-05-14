/**
 * pages.js
 * Inner-page functionality: blog search, CV toggle, smooth-scroll TOC.
 * Loaded on all inner pages via base.njk.
 */
(function () {

  /* ── Blog search ───────────────────────────────────────────────────── */
  var searchInput  = document.getElementById('blog-search');
  var noResults    = document.getElementById('blog-no-results');
  var countDisplay = document.getElementById('blog-search-count');

  if (searchInput) {
    var posts = Array.from(document.querySelectorAll('#blog-list .blog-post'));

    searchInput.addEventListener('input', function () {
      var query   = this.value.trim().toLowerCase();
      var visible = 0;

      posts.forEach(function (post) {
        var title   = (post.dataset.title   || '').toLowerCase();
        var excerpt = (post.dataset.excerpt || '').toLowerCase();
        var match   = !query || title.indexOf(query) !== -1 || excerpt.indexOf(query) !== -1;
        post.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      if (noResults)    noResults.style.display    = (query && visible === 0) ? 'block' : 'none';
      if (countDisplay) countDisplay.textContent   = query ? (visible + ' result' + (visible !== 1 ? 's' : '')) : '';
    });
  }


  /* ── About page: CV one-page / all toggle ──────────────────────────── */
  var cvHistory   = document.getElementById('cv-history');
  var printLink   = document.getElementById('print-cv-link');
  var toggleBtns  = document.querySelectorAll('.cv-toggle-btn');

  if (cvHistory && toggleBtns.length) {

    function setCvView(view) {
      /* Show or hide non-featured entries */
      if (view === 'all') {
        cvHistory.classList.add('cv-show-all');
      } else {
        cvHistory.classList.remove('cv-show-all');
      }

      /* Sync toggle button active state */
      for (var i = 0; i < toggleBtns.length; i++) {
        toggleBtns[i].classList.toggle('is-active', toggleBtns[i].dataset.view === view);
      }

      /* Update print link href */
      if (printLink) {
        printLink.href = '/cv-print/?view=' + view;
      }
    }

    for (var j = 0; j < toggleBtns.length; j++) {
      toggleBtns[j].addEventListener('click', (function (btn) {
        return function () { setCvView(btn.dataset.view); };
      })(toggleBtns[j]));
    }

    /* Initialise at one-page view */
    setCvView('one');
  }


  /* ── About page: smooth-scroll TOC links (offset for sticky header) ── */
  var tocLinks = document.querySelectorAll('.about-toc__link');
  if (tocLinks.length) {
    tocLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href   = this.getAttribute('href');
        var target = href && document.querySelector(href);
        if (!target) return;
        e.preventDefault();

        var header = document.querySelector('.site-header');
        var offset = header ? header.offsetHeight + 16 : 80;
        var top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }



  function syncThemeButtonIcons(mode) {
    var activeOccasion = window.activeOccasion || null;
    var MODES = activeOccasion ? ['occasion', 'light', 'dark'] : ['light', 'dark'];
    var iconCurrent = document.getElementById('icon-current');
    var iconHover = document.getElementById('icon-hover');
    var btnTheme = document.getElementById('btn-theme');

    var ICONS = {
      light:
        '<circle cx="12" cy="12" r="5"/>' +
        '<line x1="12" y1="1" x2="12" y2="3"/>' +
        '<line x1="12" y1="21" x2="12" y2="23"/>' +
        '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>' +
        '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
        '<line x1="1" y1="12" x2="3" y2="12"/>' +
        '<line x1="21" y1="12" x2="23" y2="12"/>' +
        '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>' +
        '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
      dark: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
      occasion: (activeOccasion && activeOccasion.icon)
        ? activeOccasion.icon
        : '<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>'
    };

    var currentMode = MODES.indexOf(mode) !== -1 ? mode : 'light';
    var nextMode = MODES[(MODES.indexOf(currentMode) + 1) % MODES.length];

    if (iconCurrent) iconCurrent.innerHTML = ICONS[currentMode] || ICONS.light;
    if (iconHover) iconHover.innerHTML = ICONS[nextMode] || ICONS.light;
    if (btnTheme) {
      btnTheme.title = 'Switch to ' + nextMode + ' mode';
      btnTheme.setAttribute('aria-label', 'Switch to ' + nextMode + ' mode');
    }
  }

  /* ── About page: Important-date theme buttons ─────────────────────────── */
  var dateThemeButtons = document.querySelectorAll('.date-theme-btn');
  if (dateThemeButtons.length) {
    dateThemeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-mode') || 'light';
        var occasionId = btn.getAttribute('data-occasion-id');
        var occasionAccent = btn.getAttribute('data-occasion-accent');

        document.documentElement.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');

        if (mode === 'occasion' && occasionId) {
          document.documentElement.setAttribute('data-occasion', occasionId);
          if (occasionAccent) document.documentElement.style.setProperty('--accent', occasionAccent);
          try { localStorage.setItem('kjo-theme', 'occasion'); } catch(e) {}
          syncThemeButtonIcons('occasion');
        } else {
          document.documentElement.removeAttribute('data-occasion');
          document.documentElement.style.removeProperty('--accent');
          try { localStorage.setItem('kjo-theme', mode); } catch(e) {}
          syncThemeButtonIcons(mode);
        }
      });
    });
  }

  /* ── Blog: read ?q= param on page load and pre-fill search ──────────── */
  if (searchInput) {
    try {
      var q = new URLSearchParams(window.location.search).get('q');
      if (q) {
        searchInput.value = q;
        searchInput.dispatchEvent(new Event('input'));
      }
    } catch (e) {}
  }

})();
