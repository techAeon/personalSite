/**
 * home.js
 * Homepage-only script. Theme/accent is handled by theme.js (base layout).
 * This file handles: date display, date link, accordion.
 *
 * Requires theme.js to have already run (DAILY and activeOccasion in scope
 * via theme.js, or re-derived here from window.DAILY).
 */
(function () {

  /* ── Date display ── */
  var DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

  var now  = new Date();
  var dd   = now.getDate();
  var mm   = now.getMonth() + 1;
  var mmdd = String(mm).padStart(2, '0') + '-' + String(dd).padStart(2, '0');
  var v    = dd % 100;
  var sfx  = (v >= 11 && v <= 13) ? 'th'
           : dd % 10 === 1 ? 'st'
           : dd % 10 === 2 ? 'nd'
           : dd % 10 === 3 ? 'rd' : 'th';

  /* theme.js computes this once and stores it globally */
  var activeOccasion = window.activeOccasion || null;

  /* Date always links to /today/ — occasion anchor if one is active */
  var todayURL = '/today/' + (activeOccasion ? '#' + activeOccasion.id : '');
  var datePart = MONTHS[now.getMonth()] + ' ' + dd + sfx;
  var dateHTML = '<a href="' + todayURL + '">' + datePart + '</a>';

  var dateEl = document.getElementById('date-text');
  if (dateEl) {
    dateEl.innerHTML = '<span class="day-name">' + DAYS[now.getDay()] + '</span>, ' + dateHTML;
  }

  /* ── Accordion ── */
  var MOBILE_BP = 768;
  var accordion = document.getElementById('nav-accordion');
  var section   = document.getElementById('content-section');
  if (!accordion || !section) return;

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
      item.querySelector('.nav-body').style.transition       = 'none';
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
      item.querySelector('.nav-body').style.transition       = '';
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
