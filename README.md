# Soumyadeep Pradhan — Portfolio (Next.js 16)

Personal portfolio + blog. Migrated from Vite/React-Router to Next.js 16 with
static export. Real prerendered HTML for every route — `/`, `/blog`, and one
page per blog post.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your API keys
npm run dev                  # http://localhost:3000 (live preview, hot reload)
```

## Build & deploy

```bash
npm run build   # outputs static site to ./out
```

The `out/` folder is fully static and ready for any host:

* GitHub Pages — push to `main`; the included workflow at
  `.github/workflows/deploy.yml` builds and publishes automatically.
* Netlify / Vercel / Cloudflare Pages — point them at `npm run build` with
  `out/` as the publish directory.
* Local preview of the built site:
  `npx serve out` (or any static file server)

## What changed vs the old Vite build

* **Real SSG.** Every page now ships prerendered HTML. The old "SSG plugin"
  produced an empty `<div id="root">` — see the `BUILD_NOTES.md` for the
  full breakdown of issues fixed.
* **Per-post code splitting.** Each MDX post is its own JS chunk. Opening one
  post no longer downloads the others. (The previous `import.meta.glob({ eager: true })`
  was bundling every post into one giant file.)
* **Lighter parallax.** Two redundant `mousemove` listeners collapsed into
  one shared rAF tracker. The animated `filter: blur()` was removed — the
  most expensive thing the old build did to the GPU. Cursor glow effect
  is preserved exactly as before.
* **Class-scoped theme transitions.** The `* { transition: ...; }` universal
  selector (which fired on every hover, every state change, on every node)
  is gone. Theme transitions only run during the actual flip via a
  short-lived `.theme-flipping` class on `<html>`.
* **Self-hosted fonts.** `next/font/google` inlines Poppins + JetBrains Mono
  at build time. No runtime requests to fonts.googleapis.com.
* **No more `react-helmet-async`.** Replaced by Next's `generateMetadata` —
  metadata bakes into the HTML at build time, no client hydration needed.
* **JSON-LD schemas baked into HTML.** Crawlers see them on first byte.
* **BMC widget on `lazyOnload`.** No longer competes with first paint.

## Project structure

```
src/
├─ app/                         App Router pages
│  ├─ layout.jsx                Root layout, fonts, GA, theme
│  ├─ page.jsx                  Home (server-rendered)
│  ├─ blog/page.jsx             Blog index (server-rendered)
│  ├─ blog/[slug]/page.jsx      Per-post pages (SSG via generateStaticParams)
│  ├─ not-found.jsx             404
│  └─ sitemap.js                /sitemap.xml at build time
├─ components/                  Shared UI (Navbar, Footer, etc.)
├─ features/                    Section-level components
│  ├─ blog/                     PostCard, BlogIndex, BlogPostDetail, etc.
│  └─ ...
├─ data/
│  └─ blog/posts/*.mdx          Blog post sources
├─ hooks/                       useTheme, useScrollReveal
├─ lib/
│  ├─ posts.js                  Server-side metadata reader
│  └─ post-loaders.js           Per-slug client lazy imports
├─ seo/                         JSON-LD schemas, JsonLd component
└─ styles/
   ├─ tokens.scss               Design system tokens (CSS variables)
   ├─ global.scss               Global rules
   └─ syntax-highlight.scss     Code highlighting
```

## Adding a new blog post

1. Drop a new `.mdx` file under `src/data/blog/posts/`.
2. Add the `frontmatter` export at the top of the file (see existing posts
   for the shape — title, date, excerpt, tags, etc.).
3. **Add the slug to `src/lib/post-loaders.js`** — the bundler needs literal
   `import()` strings to code-split per slug.

That's it. `getAllPostsMeta()` reads the directory at build time and the
`generateStaticParams()` in `app/blog/[slug]/page.jsx` picks it up.

## Environment variables

All public — copy `.env.example` to `.env.local` and fill in. For deploys,
set the same names as repository secrets in GitHub Actions (the deploy
workflow already wires them through).

## Troubleshooting

### `next dev` is showing the wrong page (e.g. blog content at `/`)

This is a Turbopack HMR cache glitch — sometimes after navigating between routes
in dev, Turbopack serves a stale chunk. The fix:

```
# Stop the dev server (Ctrl+C)
rm -rf .next
npm run dev
# Then hard-refresh the browser: Cmd+Shift+R / Ctrl+Shift+R
```

This is a dev-only issue. Production builds (`npm run build`) generate one
static HTML file per route, so it never happens in deployed builds.

### Theme briefly flashes on refresh

Should not happen in this build — `<html>` ships with an inline
`style="visibility:hidden"` attribute that blocks first paint until the
bootstrap script reads localStorage and sets the right theme. If you see a
flash, hard-refresh once to clear the old cached HTML from the previous
deployment.

## License

CC-BY-NC-ND-4.0 — see project root.
