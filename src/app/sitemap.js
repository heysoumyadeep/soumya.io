import { SITE_CONFIG } from '@config/site';
import { getAllPostsMeta } from '@lib/posts';

// Required when using `output: 'export'`: the sitemap must be statically
// generated at build time, not on demand at request time.
export const dynamic = 'force-static';

export default function sitemap() {
  const base = SITE_CONFIG.url;
  const posts = getAllPostsMeta();

  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}
