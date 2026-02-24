const footerSearchPlugin = require('./plugins/footer-search-plugin');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(footerSearchPlugin);

  eleventyConfig.addFilter('readableDate', function(dateObj) {
    if (!dateObj) return '';
    var d = new Date(dateObj);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('js');
  eleventyConfig.addPassthroughCopy('images');

  return {
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site'
    }
  };
};
