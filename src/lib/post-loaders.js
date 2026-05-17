// Each import() here gets its own JS chunk (webpack requires literal strings).
// When you add a new MDX post, add a matching entry to LOADERS below.

const LOADERS = {
  'database-indexing-explained': () => import('@/data/blog/posts/database-indexing-explained.mdx'),
  'rag-chunking-indexing':       () => import('@/data/blog/posts/rag-chunking-indexing.mdx'),
  'sde2-lessons':                () => import('@/data/blog/posts/sde2-lessons.mdx'),
  'singing-and-software':        () => import('@/data/blog/posts/singing-and-software.mdx'),
};

export async function loadPostModule(slug) {
  const loader = LOADERS[slug];
  if (!loader) return null;
  return loader();
}

export function hasLoader(slug) {
  return Boolean(LOADERS[slug]);
}
