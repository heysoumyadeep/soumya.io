// Server-only. Reads post frontmatter from disk at build time.
// Client components get post data as props from a server parent, never directly.

import fs from 'node:fs';
import path from 'node:path';

const POSTS_DIR = path.join(process.cwd(), 'src/data/blog/posts');

function slugFromFile(filename) {
  return filename.replace(/\.mdx$/, '');
}

// Pulls frontmatter from the export-const style used in each MDX file.
// Regex is enough here, no need to spin up a full MDX/AST parser just for meta.
function parseFrontmatter(source) {
  const block = source.match(/export\s+const\s+frontmatter\s*=\s*\{([\s\S]*?)\}\s*;?/);
  if (!block) return {};

  const body = block[1];
  const get = (key) => {
    const m = body.match(new RegExp(`${key}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1`));
    return m ? m[2] : '';
  };
  const getBool = (key) => {
    const m = body.match(new RegExp(`${key}\\s*:\\s*(true|false)`));
    return m ? m[1] === 'true' : false;
  };
  const getArr = (key) => {
    const m = body.match(new RegExp(`${key}\\s*:\\s*\\[([^\\]]*)\\]`));
    if (!m) return [];
    return (m[1].match(/["']([^"']+)["']/g) || []).map((s) => s.replace(/["']/g, ''));
  };

  return {
    title:    get('title'),
    date:     get('date'),
    readTime: get('readTime'),
    excerpt:  get('excerpt'),
    author:   get('author'),
    coverImage: get('coverImage') || null,
    isPremium: getBool('isPremium'),
    tags:     getArr('tags'),
  };
}

let _cache = null;

// Cached so multiple RSC calls in one request don't re-read the filesystem.
export function getAllPostsMeta() {
  if (_cache) return _cache;

  let files;
  try {
    files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
  } catch {
    _cache = [];
    return _cache;
  }

  const metas = files.map((file) => {
    const slug = slugFromFile(file);
    const fullPath = path.join(POSTS_DIR, file);
    const source = fs.readFileSync(fullPath, 'utf8');
    const fm = parseFrontmatter(source);
    return { slug, ...fm };
  });

  metas.sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (Number.isNaN(da) && Number.isNaN(db)) return 0;
    if (Number.isNaN(da)) return 1;
    if (Number.isNaN(db)) return -1;
    return db - da;
  });

  _cache = metas;
  return _cache;
}

export function getRecentPostsMeta(count) {
  return getAllPostsMeta().slice(0, count);
}

export function getPostMeta(slug) {
  return getAllPostsMeta().find((p) => p.slug === slug) || null;
}

export function getAllSlugs() {
  return getAllPostsMeta().map((p) => p.slug);
}
