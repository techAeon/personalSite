module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection('footerSearchIndex', function(collectionApi) {
    const posts = collectionApi.getFilteredByTag('posts').map((item) => ({
      title: item.data.title,
      url: item.url,
      type: 'post',
      excerpt: item.data.excerpt || ''
    }));

    const projects = collectionApi.getFilteredByTag('projects').map((item) => ({
      title: item.data.title,
      url: item.url,
      type: 'project',
      excerpt: item.data.description || ''
    }));

    const pages = [
      { title: 'About Me', url: '/about/', type: 'page', excerpt: 'Biography, fun facts, important dates, and work history.' },
      { title: 'Projects', url: '/projects/', type: 'page', excerpt: 'Current projects and experiments.' },
      { title: 'Journal', url: '/blog/', type: 'page', excerpt: 'Latest posts and writing.' },
      { title: 'Today', url: '/today/', type: 'page', excerpt: 'Occasion calendar and daily factoids.' }
    ];

    return [...posts, ...projects, ...pages];
  });
};
