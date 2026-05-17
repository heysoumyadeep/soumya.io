'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from '@components/link/Link';
import { Button } from '@components';
import PostCard from './PostCard';
import { loadPostModule } from '@lib/post-loaders';
import './BlogIndex.scss';

const UPCOMING_POST = {
  slug: '__upcoming__',
  title: 'Architectural Patterns I Followed While Building This Portfolio',
  excerpt:
    'Mistakes I made, decisions I second-guessed, and patterns that actually held up. ',
  date: 'Coming soon',
  readTime: '?',
};

export default function BlogIndex({ posts: serverPosts }) {
  const [posts] = useState(serverPosts || []);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);

  // Featured post's PreviewImage, lazy-loaded
  const [FeaturedPreview, setFeaturedPreview] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest('.blog-index__filter')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const categories = useMemo(() => {
    const allTags = posts.flatMap((p) => p.tags || []);
    return ['All', ...new Set(allTags)];
  }, [posts]);

  const visibleCategories = categories.slice(0, 4);
  const dropdownCategories = categories.slice(4);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = [...posts];
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.tags?.includes(selectedCategory));
    }
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q),
      );
    }
    return result;
  }, [posts, selectedCategory, query]);

  const featuredPost = filtered[0];
  const otherPosts = filtered.slice(1);

  // Lazy-load the featured PreviewImage when featuredPost slug changes
  useEffect(() => {
    if (!featuredPost) { setFeaturedPreview(null); return; }
    let alive = true;
    setFeaturedPreview(null);
    loadPostModule(featuredPost.slug).then((mod) => {
      if (alive && mod?.PreviewImage) setFeaturedPreview(() => mod.PreviewImage);
    });
    return () => { alive = false; };
  }, [featuredPost?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="blog-page">
      <div className="container">
        <header className="blog-index__head reveal">
          <h1 className="blog-index__title">
            <span className="gradient-text">Blog</span>.
          </h1>
          <p className="blog-index__lede">
            Notes on engineering, software craft, and the occasional detour
            into other things I find interesting.
          </p>

          <div className="blog-index__controls">
            <div className="blog-index__search">
              <svg className="blog-index__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                placeholder={`Search ${posts.length} articles...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search articles"
              />
            </div>

            <div className="blog-index__categories">
              {visibleCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`blog-index__category-btn${selectedCategory === cat ? ' active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}

              {dropdownCategories.length > 0 && (
                <div className="blog-index__filter">
                  <button
                    type="button"
                    className={`blog-index__filter-btn${dropdownCategories.includes(selectedCategory) ? ' active' : ''}`}
                    onClick={() => setShowDropdown(!showDropdown)}
                    aria-label="Show more categories"
                  >
                    {dropdownCategories.includes(selectedCategory) ? selectedCategory : 'Show more'}
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      style={{
                        transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="blog-index__dropdown">
                      {dropdownCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`blog-index__dropdown-item${selectedCategory === cat ? ' active' : ''}`}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowDropdown(false);
                          }}
                        >
                          {cat}
                          {selectedCategory === cat && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  className="blog-index__clear-btn"
                  onClick={() => setSelectedCategory('All')}
                  aria-label="Clear filters"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className="blog-index__empty">
            {query ? `No articles match "${query}". Try a different search.` : 'No articles yet.'}
          </p>
        ) : (
          <>
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="blog-index__featured"
                onMouseEnter={() => loadPostModule(featuredPost.slug).catch(() => {})}
              >
                <div className="blog-index__featured-preview">
                  {FeaturedPreview
                    ? <FeaturedPreview />
                    : <div className="blog-index__preview-fallback" />
                  }
                  <span className="blog-index__featured-label">ARTICLE PREVIEW</span>
                  {featuredPost.isPremium && (
                    <span className="blog-index__premium-badge" aria-label="Premium article">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
                      </svg>
                      Premium
                    </span>
                  )}
                </div>
                <div className="blog-index__featured-content">
                  <h2 className="blog-index__featured-title">{featuredPost.title}</h2>
                  <p className="blog-index__featured-excerpt">{featuredPost.excerpt}</p>
                  <div className="blog-index__featured-meta mono">
                    <span>{featuredPost.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredPost.readTime} read</span>
                  </div>
                  <Button variant="primary" className="blog-index__featured-btn">
                    Read article →
                  </Button>
                </div>
              </Link>
            )}

            {(otherPosts.length > 0 || featuredPost) && (
              <ul className="blog-index__grid">
                {otherPosts.map((post, index) => (
                  <li key={post.slug}>
                    <PostCard post={post} index={index + 1} showImage showTags />
                  </li>
                ))}
                <li key="upcoming">
                  <PostCard post={UPCOMING_POST} index={otherPosts.length + 1} showImage showTags upcoming />
                </li>
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  );
}
