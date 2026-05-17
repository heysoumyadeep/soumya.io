'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from '@components/link/Link';
import { ArrowRightIcon } from '@components';
import { loadPostModule } from '@lib/post-loaders';
import './PostCard.scss';

const GRADIENT_COLORS = [
  'linear-gradient(135deg, var(--palette-coral) 0%, var(--palette-crimson) 100%)',
  'linear-gradient(135deg, var(--palette-crimson) 0%, var(--palette-burgundy) 100%)',
  'linear-gradient(135deg, var(--palette-burgundy) 0%, var(--palette-plum) 100%)',
  'linear-gradient(135deg, var(--palette-plum) 0%, var(--palette-deep) 100%)',
  'linear-gradient(135deg, var(--palette-coral) 0%, var(--palette-burgundy) 100%)',
];

export default function PostCard({ post, index = 0, showImage = true, showTags = false }) {
  const [PreviewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!showImage) return;
    let alive = true;
    loadPostModule(post.slug).then((mod) => {
      if (alive && mod?.PreviewImage) setPreviewImage(() => mod.PreviewImage);
    });
    return () => { alive = false; };
  }, [post.slug, showImage]);

  // On hover, kick off the MDX chunk download so it's already cached on click.
  const handleMouseEnter = useCallback(() => {
    loadPostModule(post.slug).catch(() => {});
  }, [post.slug]);

  return (
    <Link href={`/blog/${post.slug}`} className="post-card" onMouseEnter={handleMouseEnter}>
      {showImage && (
        <div className="post-card__preview">
          {PreviewImage
            ? <PreviewImage />
            : (
              <div
                className="post-card__preview-fallback"
                style={{ background: GRADIENT_COLORS[index % GRADIENT_COLORS.length] }}
              />
            )
          }
          {post.isPremium && (
            <span className="post-card__premium-badge" aria-label="Premium article">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
              </svg>
              Premium
            </span>
          )}
        </div>
      )}

      <div className="post-card__content">
        <div className="post-card__meta mono">
          <span>{post.date}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime} read</span>
          {showTags && post.tags?.[0] && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.tags[0]}</span>
            </>
          )}
        </div>
        <h3 className="post-card__title">{post.title}</h3>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <span className="post-card__cta">
          Read article <ArrowRightIcon size={13} />
        </span>
      </div>
    </Link>
  );
}
