(function () {
  var footerSearch = document.getElementById('site-search');
  if (!footerSearch) return;

  var searchIndexPromise = null;

  function getSearchIndex() {
    if (!searchIndexPromise) {
      searchIndexPromise = fetch('/search-index.json', { credentials: 'same-origin' })
        .then(function (res) { return res.ok ? res.json() : []; })
        .catch(function () { return []; });
    }
    return searchIndexPromise;
  }

  function scoreResult(item, query) {
    var q = query.toLowerCase();
    var title = (item.title || '').toLowerCase();
    var excerpt = (item.excerpt || '').toLowerCase();
    if (title === q) return 100;
    if (title.indexOf(q) !== -1) return 70;
    if (excerpt.indexOf(q) !== -1) return 40;
    return 0;
  }

  footerSearch.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var query = this.value.trim();
    if (!query) return;
    e.preventDefault();

    getSearchIndex().then(function (index) {
      var best = null;
      var bestScore = 0;

      for (var i = 0; i < index.length; i++) {
        var s = scoreResult(index[i], query);
        if (s > bestScore) {
          bestScore = s;
          best = index[i];
        }
      }

      if (best && best.url) {
        window.location.href = best.url;
      } else {
        window.location.href = '/blog/?q=' + encodeURIComponent(query);
      }
    });
  });
})();
