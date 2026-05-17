'use client';

import { useEffect, useRef, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { loadPostModule } from '@lib/post-loaders';

const components = {};

export default function BlogPostBody({ slug, placeholder = null }) {
  const [Component, setComponent] = useState(null);
  const [missing, setMissing] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setComponent(null);
    setMissing(false);
    loadPostModule(slug).then((mod) => {
      if (!alive) return;
      if (mod?.default) setComponent(() => mod.default);
      else setMissing(true);
    }).catch(() => {
      if (alive) setMissing(true);
    });
    return () => { alive = false; };
  }, [slug]);

  // Load highlight.js only after MDX renders. Keeps it out of the main bundle.
  useEffect(() => {
    if (!Component || !containerRef.current) return;
    let cancelled = false;

    Promise.all([
      import('highlight.js/lib/common'),
      import('highlight.js/styles/atom-one-dark.css'),
    ]).then(([{ default: hljs }]) => {
      if (cancelled || !containerRef.current) return;
      containerRef.current.querySelectorAll('pre code').forEach((block) => {
        try { hljs.highlightElement(block); } catch { /* noop */ }
      });
    }).catch(() => { /* highlight.js is optional */ });

    return () => { cancelled = true; };
  }, [Component, slug]);

  if (missing) return null;

  if (!Component) {
    return <div className="blog-post-body--loading">{placeholder}</div>;
  }

  return (
    <div ref={containerRef}>
      <MDXProvider components={components}>
        <Component />
      </MDXProvider>
    </div>
  );
}
