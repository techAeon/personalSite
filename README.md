# Kieran J. O'Leary - Personal Website

A minimalist, typography-focused personal website built with Eleventy (11ty).

## Design Features

- **Minimalist aesthetic** with artistic hand-drawn touches
- **Typography-first** design using Playfair Display and Inter
- **Robin blue** (#5DADE2) accent color
- **CSS-only effects** - no heavy JavaScript
- **Mobile responsive** layout
- **Tabbed homepage** with interactive content switching
- **Charcoal sketch** image effect on hover

## Structure

```
.
├── _includes/          # Layout templates
│   ├── base.njk       # Base HTML structure
│   ├── post.njk       # Blog post layout
│   └── project.njk    # Project page layout
├── posts/             # Blog posts (Markdown)
├── projects/          # Project pages (Markdown)
├── css/               # Stylesheets
├── images/            # Images and assets
├── index.njk          # Homepage with tabs
├── about.njk          # Full about page
├── cv.njk             # Full CV page
├── blog.njk           # Blog listing
├── projects.njk       # Projects listing
└── .eleventy.js       # Eleventy configuration
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

Site will be available at `http://localhost:8080`

## Adding Content

### New Blog Post

Create a new `.md` file in `posts/`:

```markdown
---
title: Your Post Title
date: 2026-02-07
excerpt: Short description for listings
---

Your content here in Markdown...
```

### New Project

Create a new `.md` file in `projects/`:

```markdown
---
title: Project Name
description: Short description for card
date: 2026-02-07
---

Full project details in Markdown...
```

## Deployment

### Netlify

1. Push your code to GitHub
2. Connect your repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `_site`

### Manual Deployment

Build the site and upload the `_site` folder to any static hosting service.

## Customization

### Colors

Edit `css/style.css` root variables:
```css
:root {
  --robin-blue: #5DADE2;
  --charcoal: #2C2C2C;
  --light-gray: #F5F5F5;
}
```

### Fonts

Currently using Google Fonts (Playfair Display + Inter). Change in `css/style.css` @import and variables.

### Homepage Content

Edit `index.njk` to update the About, CV, Projects, and Blog tab content.

## Features

- ✅ Responsive design
- ✅ Artistic CSS effects
- ✅ Lightweight JavaScript (tabs only)
- ✅ Blog with posts
- ✅ Projects showcase
- ✅ Full CV page
- ✅ About page
- ⬜ Dark mode (future)
- ⬜ Search (future)
- ⬜ RSS feed (future)

## License

ISC

## Contact

Kieran J. O'Leary
- Email: kieran.j.oleary@gmail.com
- Location: Munich, Germany & Pittsburgh, PA
