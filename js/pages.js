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
        } else {
          document.documentElement.removeAttribute('data-occasion');
          document.documentElement.style.removeProperty('--accent');
          try { localStorage.setItem('kjo-theme', mode); } catch(e) {}
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
