import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import sharp from 'sharp';

const POSTS_DIR = 'src/data/blog/posts';
const OUT_DIR = 'public/og-images';

// Chars per line limits - calibrated so lines stay within x=80..1120 (80px margins both sides)
// 64px bold Arial: ~37px/char → 1040px / 37 ≈ 28 chars
// 26px regular Arial: ~14px/char → 1040px / 14 ≈ 74 chars
const TITLE_MAX = 28;
const DESC_MAX = 74;

function parseFrontmatter(source) {
  const block = source.match(/export\s+const\s+frontmatter\s*=\s*\{([\s\S]*?)\}\s*;?/);
  if (!block) return {};
  const body = block[1];
  const get = (key) => {
    const m = body.match(new RegExp(`${key}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1`));
    return m ? m[2] : '';
  };
  return { title: get('title'), excerpt: get('excerpt'), readTime: get('readTime') };
}

function wordWrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= max) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSVG({ title, excerpt, readTime }) {
  const titleLines = wordWrap(title, TITLE_MAX);
  const descLines = wordWrap(excerpt, DESC_MAX);

  const TITLE_SIZE = 64;
  const TITLE_LH = 80;
  const DESC_SIZE = 26;
  const DESC_LH = 38;

  const titleY = titleLines.length >= 3 ? 228 : 248;
  const descY = titleY + titleLines.length * TITLE_LH + 14;

  const titleEls = titleLines
    .map((l, i) => `  <text x="80" y="${titleY + i * TITLE_LH}" font-family="Arial, Helvetica, sans-serif" font-size="${TITLE_SIZE}" font-weight="700" fill="#2d142c">${esc(l)}</text>`)
    .join('\n');

  const descEls = descLines
    .map((l, i) => `  <text x="80" y="${descY + i * DESC_LH}" font-family="Arial, Helvetica, sans-serif" font-size="${DESC_SIZE}" font-weight="400" fill="rgba(45,20,44,0.72)">${esc(l)}</text>`)
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fdf6f0"/>
      <stop offset="100%" style="stop-color:#f8ecec"/>
    </linearGradient>
    <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   style="stop-color:#ee4540;stop-opacity:0.25"/>
      <stop offset="60%"  style="stop-color:#c72c41;stop-opacity:0.08"/>
      <stop offset="100%" style="stop-color:#c72c41;stop-opacity:0"/>
    </radialGradient>
    <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   style="stop-color:#c72c41;stop-opacity:0.20"/>
      <stop offset="60%"  style="stop-color:#801336;stop-opacity:0.07"/>
      <stop offset="100%" style="stop-color:#801336;stop-opacity:0"/>
    </radialGradient>
    <radialGradient id="orb3" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   style="stop-color:#ee4540;stop-opacity:0.14"/>
      <stop offset="100%" style="stop-color:#ee4540;stop-opacity:0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="60"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="72"/></filter>
    <filter id="blur3"><feGaussianBlur stdDeviation="48"/></filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1100" cy="-60"  r="380" fill="url(#orb1)" filter="url(#blur1)"/>
  <circle cx="-80"  cy="480"  r="340" fill="url(#orb2)" filter="url(#blur2)"/>
  <circle cx="1150" cy="660"  r="300" fill="url(#orb3)" filter="url(#blur3)"/>
  <rect x="80" y="56" width="52" height="52" rx="10" fill="#c72c41"/>
  <text x="106" y="93" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">S</text>
  <text x="148" y="90" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" fill="#2d142c">soumya.io</text>
  <text x="1120" y="90" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#c72c41" text-anchor="end" letter-spacing="2">BLOG</text>
  <text x="80" y="163" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="400" fill="rgba(45,20,44,0.50)">Soumyadeep Pradhan · Software Engineer II</text>
${titleEls}
${descEls}
  <text x="80" y="572" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="400" fill="rgba(45,20,44,0.50)">${readTime} read</text>
</svg>`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
  let count = 0;
  for (const file of files) {
    const slug = basename(file, '.mdx');
    const source = readFileSync(join(POSTS_DIR, file), 'utf-8');
    const { title, excerpt, readTime } = parseFrontmatter(source);
    if (!title || !excerpt) {
      console.warn(`[og] skipping ${slug}: missing title or excerpt`);
      continue;
    }
    const svg = buildSVG({ title, excerpt, readTime });
    await sharp(Buffer.from(svg, 'utf-8')).png().toFile(join(OUT_DIR, `${slug}.png`));
    console.log(`[og] ${slug}`);
    count++;
  }
  console.log(`[og] generated ${count} image${count !== 1 ? 's' : ''}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
