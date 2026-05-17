'use client';

import { useEffect, useState } from 'react';
import './CalloutBox.scss';

const ArrowIcon = () => (
  <svg
    className="callout-box__arrow"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 10H16M16 10L11 5M16 10L11 15"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function CalloutBox({
  badge = 'Prerequisite Reading',
  title,
  linkText = 'Read more',
  slug,
  readTime: initialReadTime = null,
}) {
  const [readTime, setReadTime] = useState(initialReadTime);

  // If readTime wasn't passed in from the server, look it up at runtime via
  // a tiny fetch of the slug's loader. This keeps the prop optional for posts
  // authored before the prop existed.
  useEffect(() => {
    if (initialReadTime || !slug) return;
    let alive = true;
    import('@lib/post-loaders').then(({ loadPostModule }) => {
      loadPostModule(slug).then((mod) => {
        if (alive && mod?.frontmatter?.readTime) {
          setReadTime(mod.frontmatter.readTime);
        }
      });
    });
    return () => { alive = false; };
  }, [slug, initialReadTime]);

  const handleClick = () => {
    if (slug) window.open(`/blog/${slug}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="callout-box" onClick={handleClick}>
      <div className="callout-box__inner">
        <div className="callout-box__badge-row">
          <span className="callout-box__badge">{badge}</span>
          {readTime && <span className="callout-box__duration">{readTime}</span>}
        </div>
        <div className="callout-box__title">{title}</div>
        <div className="callout-box__link">
          <span>{linkText}</span>
          <ArrowIcon />
        </div>
      </div>
    </div>
  );
}
