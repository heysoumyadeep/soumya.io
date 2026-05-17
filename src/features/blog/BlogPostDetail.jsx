'use client';

import { useState, useEffect, useRef } from 'react';
import Link from '@components/link/Link';
import { incrementView } from './ViewTracker';
import BlogPostBody from './BlogPostBody';
import BlogFeedback from './BlogFeedback';
import PremiumGate from './PremiumGate';
import { SITE_CONFIG } from '@config/site';
import './BlogPostDetail.scss';

export default function BlogPostDetail({ post, nextPost }) {
  const [views, setViews] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const viewTrackedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    viewTrackedRef.current = false;

    if (post && !viewTrackedRef.current) {
      viewTrackedRef.current = true;
      incrementView(post.slug)
        .then((newCount) => { if (mounted) setViews(newCount); })
        .catch(() => {});
    }

    // Scroll to top on slug change
    window.scrollTo(0, 0);

    return () => { mounted = false; };
  }, [post?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!post) {
    return (
      <main className="blog-page">
        <div className="blog-post-wrap container">
          <article className="blog-post">
            <div className="blog-post__missing">
              <p className="blog-post__missing-code mono">404</p>
              <h1 className="blog-post__missing-title">No blog at this URL.</h1>
              <p className="blog-post__missing-lede">
                That post doesn&apos;t exist. It may have been moved or the URL is off.
              </p>
              <Link href="/blog" className="blog-post__missing-btn">
                Browse all articles →
              </Link>
            </div>
          </article>
        </div>
      </main>
    );
  }

  const isoDate = post.date ? new Date(post.date).toISOString() : undefined;

  const body = (
    <BlogPostBody
      slug={post.slug}
      placeholder={<p style={{ opacity: 0.6 }}>Loading article…</p>}
    />
  );

  return (
    <main className="blog-page">
      <div
          className={`blog-post-wrap container${expanded ? ' blog-post-wrap--expanded' : ''}`}
          style={{ maxWidth: expanded ? '82vw' : 'var(--max-width)' }}
        >
        <article className="blog-post">
          <div className="blog-post__topbar">
            <Link href="/blog" className="blog-post__back">
              ← Back to all articles
            </Link>
            <button
              type="button"
              className="blog-post__expand-btn"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? 'Collapse to reading width' : 'Expand to full width'}
              title={expanded ? 'Collapse' : 'Expand width'}
            >
              {expanded ? '⟵ Collapse' : '⟷ Expand'}
            </button>
          </div>

          <div className="blog-post__meta mono">
            <time dateTime={isoDate}>{post.date}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readTime} read</span>
            <span aria-hidden="true">·</span>
            <span>{views} views</span>
          </div>

          <h1 className="blog-post__title">{post.title}</h1>

          <address className="blog-post__byline">
            By <a rel="author" href={SITE_CONFIG.url}>{post.author}</a>
          </address>

          <p className="blog-post__excerpt">{post.excerpt}</p>

          <div className="blog-post__body">
            {post.isPremium
              ? <PremiumGate slug={post.slug} tags={post.tags}>{body}</PremiumGate>
              : body}
          </div>

          {post.tags?.length > 0 && !post.isPremium && (
            <div className="blog-post__tags-footer">
              <span className="blog-post__tags-label">TAGS</span>
              <ul className="blog-post__tags" aria-label="Post tags">
                {post.tags.map((tag) => (
                  <li key={tag} className="blog-post__tag">{tag}</li>
                ))}
              </ul>
            </div>
          )}

          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className="blog-post__next-article">
              <span className="blog-post__next-label">NEXT ARTICLE</span>
              <h3 className="blog-post__next-title">{nextPost.title}</h3>
              <span className="blog-post__next-arrow" aria-hidden="true">→</span>
            </Link>
          )}

          <BlogFeedback slug={post.slug} title={post.title} />
        </article>
      </div>
    </main>
  );
}
