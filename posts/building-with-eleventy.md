---
title: Building a Static Site with Eleventy
date: 2026-02-07
excerpt: My journey creating a minimalist, typography-focused personal website using 11ty and CSS.
---

## Why Eleventy?

After years of working with complex content management systems, I wanted something simpler for my personal site. Eleventy (11ty) offered the perfect balance:

- **Speed:** Static sites are inherently fast
- **Flexibility:** Multiple template languages supported
- **Simplicity:** No database, no server-side complexity
- **Control:** Complete ownership of the output

## Design Philosophy

I wanted a site that reflected my professional approach: clean, direct, and focused on substance over flash. The design principles were:

### Typography First

Good typography is the foundation of readable content. I chose:
- **Playfair Display** for headings - elegant and professional
- **Inter** for body text - highly readable on screens

### Artistic Touches

Rather than relying on heavy JavaScript or complex animations, I used CSS to create subtle "hand-drawn" effects:

- Pencil-sketch borders using box-shadow
- Slightly imperfect lines using transforms
- Charcoal filter effects on images
- Robin blue accent color for visual interest

### Mobile Responsive

The layout adapts seamlessly from desktop to mobile, with a single-column layout on small screens that maintains the artistic aesthetic.

## Technical Implementation

The site uses:
- Nunjucks templates for layouts
- Markdown for content
- Pure CSS (no frameworks except Google Fonts)
- Minimal JavaScript (just tab switching on homepage)

## Lessons Learned

Building from scratch taught me:
1. **CSS is powerful** - Modern CSS can handle complex layouts without frameworks
2. **Static sites scale** - No server means no scaling concerns
3. **Content focus matters** - Simple designs put the focus on writing
4. **Iteration is key** - Starting simple and adding features beats starting complex

## Next Steps

Future improvements I'm considering:
- Dark mode toggle
- Search functionality
- RSS feed for blog posts
- Integration with external services (GitHub, LinkedIn)

The full source code will be available on GitHub once I finalize the design.
