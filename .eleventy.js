const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {

  // ── Static assets ──────────────────────────────────────────────────────────
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");

  // Copy daily.json from _data into /js/ so it's publicly fetchable
  // (used as fallback if window.DAILY isn't set for some reason)
  eleventyConfig.addPassthroughCopy({ "_data/daily.json": "js/daily.json" });

  // ── Filters ────────────────────────────────────────────────────────────────

  // Your existing readable date filter — unchanged
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  // MM-dd or yyyy formatter for today.njk post filtering
  // Usage in template: {{ post.date | dateOnly('MM-dd') }}
  eleventyConfig.addFilter("dateOnly", (dateObj, format) => {
    const d = new Date(dateObj);
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const yyyy = String(d.getUTCFullYear());
    if (format === 'MM-dd')  return `${mm}-${dd}`;
    if (format === 'yyyy')   return yyyy;
    return `${yyyy}-${mm}-${dd}`;
  });

  // Render a markdown string to HTML — used by about.njk to import occasions-content.md
  // Usage in template: {{ occasionsContent | markdown | safe }}
  const md = markdownIt({ html: true });
  eleventyConfig.addFilter("markdown", (content) => md.render(content || ""));

  // ── Collections ────────────────────────────────────────────────────────────

  // Blog posts — your existing collection, unchanged
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md").reverse();
  });

  // Projects — your existing collection, unchanged
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("projects/*.md");
  });

  // ── Return ─────────────────────────────────────────────────────────────────
  return {
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/"
  };
};
