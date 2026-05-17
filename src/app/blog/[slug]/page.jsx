import { notFound } from 'next/navigation';
import { Navbar, Footer, ParallaxBackground, SupportSnackbar } from '@components';
import BlogPostDetail from '@features/blog/BlogPostDetail';
import JsonLd from '@seo/JsonLd';
import { blogPostingSchema, breadcrumbSchema, websiteSchema } from '@seo/schemas';
import { SITE_CONFIG } from '@config/site';
import { getAllPostsMeta, getPostMeta, getAllSlugs } from '@lib/posts';
import RevealClient from '@/app/_RevealClient';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostMeta(slug);
  if (!post) {
    return { title: 'Not found' };
  }

  const url = `${SITE_CONFIG.url}/blog/${slug}`;
  const image = `${SITE_CONFIG.url}/og-images/${slug}.png`;
  const isoDate = post.date ? new Date(post.date).toISOString() : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${post.title} - ${post.author}`,
        },
      ],
      publishedTime: isoDate,
      modifiedTime: isoDate,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
    keywords: post.tags?.join(', '),
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostMeta(slug);
  if (!post) notFound();

  const all = getAllPostsMeta();
  const idx = all.findIndex((p) => p.slug === slug);
  const nextPost = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const schemas = [
    websiteSchema,
    blogPostingSchema(post),
    breadcrumbSchema([
      { name: 'Home', url: SITE_CONFIG.url },
      { name: 'Blog', url: `${SITE_CONFIG.url}/blog` },
      { name: post.title, url: `${SITE_CONFIG.url}/blog/${slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <ParallaxBackground />
      <Navbar />
      <BlogPostDetail post={post} nextPost={nextPost} />
      <Footer />
      <SupportSnackbar />
      <RevealClient />
    </>
  );
}
