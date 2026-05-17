# Personal Portfolio (Next.js 16)

[![Site status](https://img.shields.io/website?url=https%3A%2F%2Fsoumya.io&label=soumya.io&style=flat-square)](https://www.soumya.io)

Personal portfolio + blog built with Next.js 16 (App Router). Every route ships as prerendered HTML — `/`, `/blog`, and one page per post.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your API keys
npm run dev                  # http://localhost:3000
```

## Build & deploy

```bash
npm run build   # outputs static site to ./out
```

The `out/` folder is fully static — drop it on any host:

- **GitHub Pages** — push to `main`; the workflow at `.github/workflows/deploy.yml` builds and publishes automatically.
- **Netlify / Vercel / Cloudflare Pages** — point at `npm run build` with `out/` as the publish directory.
- **Local preview:** `npx serve out`

## Project structure

```
src/
├─ app/
│  ├─ layout.jsx                Root layout, fonts, GA, theme bootstrap
│  ├─ page.jsx                  Home
│  ├─ not-found.jsx             404
│  ├─ loading.jsx               Route transition skeleton
│  ├─ sitemap.js                /sitemap.xml (generated at build)
│  ├─ blog/
│  │  ├─ page.jsx               Blog index
│  │  └─ [slug]/page.jsx        Per-post pages (SSG via generateStaticParams)
│  └─ api/
│     ├─ views/route.js         Post view counts (Supabase)
│     ├─ contact/route.js       Contact form (Resend)
│     └─ feedback/route.js      Post feedback
├─ components/                  Shared UI (Navbar, Footer, CursorGlow, etc.)
├─ config/site.js               Site URL, nav items, external links
├─ data/
│  ├─ personal.js               Name, bio, social links
│  ├─ projects.js / experience.js / skills.js
│  └─ blog/posts/*.mdx          Blog post sources
├─ features/                    Section-level components (Hero, About, Blog, etc.)
├─ hooks/                       useTheme, useScrollReveal
├─ lib/
│  ├─ posts.js                  Server-side post metadata reader
│  └─ post-loaders.js           Per-slug lazy imports for code splitting
├─ seo/
│  ├─ schemas.js                JSON-LD schema builders
│  ├─ keywords.js               SEO keywords (per-page + per-post)
│  └─ JsonLd.jsx                Script tag component for LD+JSON
└─ styles/
   ├─ tokens.scss               Design tokens (CSS variables)
   ├─ global.scss               Global rules
   └─ syntax-highlight.scss     Code block highlighting
```

## Adding a new blog post

1. Drop a new `.mdx` file under `src/data/blog/posts/`.
2. Add the `frontmatter` export at the top — title, date, excerpt, tags (see existing posts for shape).
3. **Add the slug to `src/lib/post-loaders.js`** — literal `import()` strings are required for per-slug code splitting.

`getAllPostsMeta()` picks it up at build time and `generateStaticParams()` creates the static route automatically.

## Environment variables

Copy `.env.example` to `.env.local` and fill in. For deploys, set the same names as repository secrets in GitHub Actions.

## Troubleshooting

### `next dev` shows the wrong page

Turbopack HMR cache glitch. Fix:

```bash
rm -rf .next && npm run dev
# Then hard-refresh: Cmd+Shift+R / Ctrl+Shift+R
```

Build output is unaffected, static HTML per route has no such issue.

### Theme flashes on refresh

Shouldn't happen - `<html>` starts with `visibility:hidden` until the inline bootstrap script reads `localStorage` and sets `data-theme`. If you see it, hard-refresh once to clear stale cached HTML.

## License

CC-BY-NC-ND-4.0 - see project root.
