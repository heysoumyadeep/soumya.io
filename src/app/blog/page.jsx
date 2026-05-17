import { Navbar, Footer, ParallaxBackground, SupportSnackbar } from '@components';
import BlogIndex from '@features/blog/BlogIndex';
import JsonLd from '@seo/JsonLd';
import { blogSchema, websiteSchema } from '@seo/schemas';
import { getAllPostsMeta } from '@lib/posts';
import RevealClient from '@/app/_RevealClient';

export const metadata = {
  title: 'Blog',
  description:
    'Notes on engineering, software craft, and the occasional detour into other things I find interesting. Written by Soumyadeep Pradhan, Full-Stack Developer at JPMorgan Chase.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const posts = getAllPostsMeta();
  const schemas = [websiteSchema];
  const blog = blogSchema(posts);
  if (blog) schemas.push(blog);

  return (
    <>
      <JsonLd data={schemas} />
      <ParallaxBackground />
      <Navbar />
      <BlogIndex posts={posts} />
      <Footer />
      <SupportSnackbar />
      <RevealClient />
    </>
  );
}
